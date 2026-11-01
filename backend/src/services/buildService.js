const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const Redis = require('ioredis');
const { Server } = require('socket.io');
const { generateSlug } = require('random-word-slugs');

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const socketServer = new Server({
  cors: {
    origin: '*'
  }
});

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    : undefined
});

const buildConfig = {
  cluster: process.env.AWS_ECS_CLUSTER,
  taskDefinition: process.env.AWS_ECS_TASK_DEFINITION,
  subnets: (process.env.AWS_ECS_SUBNETS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  securityGroups: (process.env.AWS_ECS_SECURITY_GROUPS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
};

socketServer.on('connection', (socket) => {
  socket.on('subscribe', (channel) => {
    socket.join(channel);
    socket.emit('message', `Joined ${channel}`);
  });
});

const startSocketServer = () => {
  const socketPort = Number(process.env.SOCKET_PORT || 9002);
  socketServer.listen(socketPort, () => {
    console.log(`Socket Server running on port ${socketPort}`);
  });
};

const initRedisSubscribe = () => {
  subscriber.psubscribe('logs:*');

  subscriber.on('pmessage', (pattern, channel, message) => {
    socketServer.to(channel).emit('message', message);
  });

  console.log('Redis subscriber started for logs:*');
};

const startBuild = async ({ gitURL, slug } = {}) => {
  if (!gitURL) {
    throw new Error('gitURL is required');
  }

  const projectSlug = slug || generateSlug();

  if (!buildConfig.cluster || !buildConfig.taskDefinition) {
    throw new Error('Set AWS_ECS_CLUSTER and AWS_ECS_TASK_DEFINITION in your backend .env file');
  }

  const command = new RunTaskCommand({
    cluster: buildConfig.cluster,
    taskDefinition: buildConfig.taskDefinition,
    launchType: 'FARGATE',
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: 'ENABLED',
        subnets: buildConfig.subnets,
        securityGroups: buildConfig.securityGroups
      }
    },
    overrides: {
      containerOverrides: [
        {
          name: 'builder-image',
          environment: [
            { name: 'GIT_REPOSITORY__URL', value: gitURL },
            { name: 'PROJECT_ID', value: projectSlug }
          ]
        }
      ]
    }
  });

  await ecsClient.send(command);

  return {
    status: 'queued',
    data: {
      projectSlug,
      url: `http://${projectSlug}.localhost:8000`
    }
  };
};

module.exports = {
  startBuild,
  initRedisSubscribe,
  startSocketServer,
  socketServer
};

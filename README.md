# 🚀 Doppler – Automated Web Deployment Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-Powered-orange.svg)](https://aws.amazon.com/)

Doppler is an automated deployment platform that allows developers to deploy web applications simply by pushing code to GitHub.
Built using AWS, Docker, Jenkins, GitHub Actions, Node.js, and a custom reverse proxy layer, Doppler automates the entire process of building, containerizing, and hosting applications — all while providing a clean dashboard for logs, deployment status, and URLs.

---

## 🧾 Introduction

Doppler is a cloud-based automated deployment platform that lets users deploy apps instantly through GitHub integration.
When a user pushes code, Doppler automatically:

- Builds the project
- Creates a Docker container
- Deploys it on AWS infrastructure
- Generates a deployment URL
- Tracks status & logs in a dashboard

This makes Doppler ideal for:

- Student projects
- Hackathon submissions
- Small developer teams
- Full-stack web applications

---

## ⭐ Features

### 🔐 User Authentication
- JWT-based login
- Optional GitHub OAuth (for repo access)

### 🔗 GitHub Integration
- Connect a repository
- Auto-create a webhook
- Trigger deployments on every push

### 🔧 CI/CD Automation
- GitHub Actions for testing
- Jenkins for build + dockerization
- Automated deployment pipeline

### 🐳 Dockerized Isolation
Each project runs in its own container for security & scalability.

### 📊 Deployment Dashboard
- View deployments
- Check live status
- Access real-time logs
- Open deployed URL

### ☁️ AWS Cloud Hosting
- EC2 for Jenkins + Docker runtime
- Route 53 for subdomains
- S3 for logs & artifacts
- Custom reverse proxy for deployment URLs

---

## 🏗 Architecture

```
              ┌───────────────┐
              │     User       │
              └──────┬────────┘
                     │ Login / Create Project
              ┌──────▼────────┐
              │  Doppler UI    │
              └──────┬────────┘
                     │ API Calls
              ┌──────▼────────┐
              │ Doppler Backend│
              └──────┬────────┘
          Create webhook │
                     ┌──▼───────────────────────────────┐
                     │          GitHub Repo              │
                     └──┬───────────────────────────────┘
                        │ Push Event Triggers Webhook
              ┌─────────▼──────────┐
              │ Doppler Webhook API │
              └─────────┬──────────┘
                        │ Trigger Build
              ┌─────────▼──────────────┐
              │      Jenkins Server     │
              └─────────┬──────────────┘
                        │ Build → Dockerize → Run
              ┌─────────▼──────────────┐
              │   AWS EC2 (Docker Host) │
              └─────────┬──────────────┘
                        │ Expose via Reverse Proxy
              ┌─────────▼──────────┐
              │  Subdomain / URL   │
              └─────────────────────┘
```

---

## 🧰 Tech Stack

### Frontend
- React.js
- Axios
- TailwindCSS (optional)

### Backend
- Node.js
- Express.js
- MongoDB / PostgreSQL
- JWT Auth

### CI/CD
- GitHub Actions
- Jenkins Pipelines

### Cloud Infrastructure
- AWS EC2
- Custom reverse proxy
- Docker & Docker Compose
- Route 53
- S3 (optional)

---

## 🔄 System Workflow

1. User logs in to Doppler dashboard
2. User adds GitHub repo + config
3. Doppler automatically creates a GitHub webhook
4. User pushes code → GitHub triggers webhook
5. Backend triggers Jenkins pipeline
6. Jenkins:
   - Clones repo
   - Installs dependencies
   - Builds app
   - Builds Docker image
   - Runs container on EC2
7. Backend stores deployment info
8. Frontend shows updated deployment logs & URL

---

## 📁 Project Structure

```
doppler/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   └── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── jenkins/
│   └── Jenkinsfile (CI/CD pipeline)
│
└── services/
    └── build-server/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Docker & Docker Compose
- MongoDB or PostgreSQL
- AWS Account
- Jenkins Server
- GitHub Account

### 1. Clone Repository

```bash
git clone https://github.com/whyom17/doppler.git
cd doppler
```

### 🛠 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

**Environment Variables:**

```env
PORT=3000
MONGO_URI=your-db-uri
JWT_SECRET=your-secret
JENKINS_URL=http://your-jenkins:8080
JENKINS_USER=admin
JENKINS_TOKEN=xxxxxx
```

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🧪 CI/CD Pipeline

**GitHub → Jenkins → Docker → Deployment**

- Jenkinsfile builds & dockerizes app
- Docker container gets hosted on EC2
- Backend receives callback from Jenkins
- Dashboard updates deployment status

---

## 🌍 Deployment

**Production Deployment Includes:**

- AWS EC2
- Custom reverse proxy
- PM2 or systemd for backend
- SSL via Let's Encrypt
- Route 53 for domain + subdomains

---

## 🔮 Future Enhancements

- Live logs streaming (WebSockets)
- Support for custom domains
- Build caching
- Multi-cloud support (GCP / Azure)
- Build artifacts storage on S3
- Serverless functions (like Vercel Edge Runtime)
- User-level rate limiting & quotas

---

## 📄 License

MIT License - Feel free to use this project for learning or production.

---

⭐ **Star this repo if you find it helpful!**

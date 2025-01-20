# real-time-bidding-system

# Project Overview

- This project is a Real-Time Auction System built with the following technologies:

# Frontend

- React (with TypeScript)

- Ant Design (UI)

- Socket.IO Client

# Backend

- Node.js

- NestJS
 
- Socket.IO (real-time updates)
 
- TypeORM (ORM for database management)
 
- PostgreSQL (Database)
 
- Docker (Containerization)

# CI/CD

- GitHub Actions

- Netlify (Frontend Hosting)
 
- Render (Backend Hosting)

# Running the Application Locally

## Prerequisites

- Node.js (v18 or higher)

- Docker (for containerized setup)
 
- Git
 
- npm or yarn

## Backend Setup

### Clone the repository:

- git clone repo_url
 
- cd /backend
 
- Create a .env file in the backend directory with the following variables:

#### DATABASE_HOST=localhost
#### DATABASE_PORT=5432
#### DATABASE_USER=postgres
#### DATABASE_PASSWORD=1234
#### DATABASE_NAME=auction_db
#### PORT=3001

## Install dependencies:

- npm install

- Run the backend:
 
- Without Docker:
 
- npm run start:dev
 
- With Docker:
- Ensure Docker is running and execute:
 
- docker-compose up --build
 
- Access the backend API at http://localhost:3001.

# Frontend Setup

- Navigate to the frontend directory:

- cd ../frontend

- Install dependencies:

- npm install

- Create a .env file in the frontend directory with the following variables:

- Start the frontend:
 
- npm run dev
 
- Access the frontend at http://localhost:5173.

# Approach to Development

## Key Decisions

### Frontend:

- Chose React for its component-based architecture and real-time UI updates with Socket.IO.

- Used Ant Design for rapid and consistent UI development.

### Backend:

- Used NestJS for its modular architecture and easy integration with WebSocket (Socket.IO).

- Implemented TypeORM for database migrations and query management.

### Real-Time Features:

- Integrated Socket.IO to enable real-time auction updates (e.g., bid changes, auction end times).

### Dockerization:

- Containerized both backend and frontend to ensure consistency across environments.

- Ensuring Robustness and Scalability

### Scalability:

- Used WebSocket namespaces and rooms to manage real-time updates efficiently per auction.

- Designed database schema with proper indexing to handle high traffic.

### Robustness:

- Implemented error handling across backend services.

- Used try-catch blocks for database and API operations.

### Race Conditions:

- Addressed bidding race conditions by ensuring atomic database operations in the backend.

- Transactions were used in TypeORM for bid placement logic.
 
- CI/CD Pipeline Setup
 
- Pipeline Overview
 
- The pipeline automates testing, Docker image building, and deployment.
 
- GitHub Actions Workflow
 
- The pipeline is defined in .github/workflows/deploy.yml.

# Pipeline Steps

## Trigger:

- Runs on every push to the main branch.

## Steps:

- Checkout code.

- Install dependencies for both frontend and backend.

- Run tests.

- Build Docker images for backend and frontend.

- Push Docker images to Docker Hub.
 
- Deploy frontend to Netlify.
 
- Deploy backend to Render.

## Secrets in GitHub

### Docker Hub:

- DOCKER_HUB_USERNAME

- DOCKER_HUB_PASSWORD

## Netlify:

- NETLIFY_AUTH_TOKEN

- NETLIFY_SITE_ID

## Heroku:

- HEROKU_API_KEY

- Service-specific details for deployment.

- Run the Pipeline

- Push changes to the main branch:

- git add .
- git commit -m "Update code"
- git push origin main

- The pipeline will automatically build, test, and deploy your application.

# Deployment

## Frontend Deployment

- Hosted on Netlify.

- Automatically triggered via GitHub Actions pipeline.

- URL: https://realtime-bidding-system-one.vercel.app/

## Backend Deployment

- Hosted on Render.

- Automatically triggered via GitHub Actions pipeline.

- URL: https://realtime-bidding-system-6e5d79fdc24c.herokuapp.com
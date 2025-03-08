# Real-Time File Processing Microservice
Overview
This is a full-stack application that features a Node.js microservice responsible for processing large log files asynchronously using BullMQ with Redis. The frontend, built with Next.js 15.x and React 18.x, provides real-time analytics for log processing. The backend leverages Supabase for authentication and storing processed log data.

# The entire system is deployed using Docker, and it supports the following key features:

Log file uploads and asynchronous processing using BullMQ and Redis.
Real-time analytics through a Next.js frontend.
User authentication with Supabase.
Docker deployment for easy orchestration of services.
Optimized for performance to process large log files (e.g., 1GB) under 5 minutes.
Features
# Backend
Log File Uploads: Accept log file uploads via a Next.js API route (/api/upload-logs).
BullMQ Integration: Use BullMQ with a Redis-backed queue (log-processing-queue) to process files asynchronously.
Job Processing: Process 4 jobs concurrently with BullMQ.
Log Parsing: Parse log entries using streams and store results in Supabase.
# API Routes:
POST /api/upload-logs: Upload and enqueue a log file for processing.
GET /api/stats: Fetch aggregated stats from Supabase.
GET /api/stats/[jobId]: Fetch stats for a specific job.
GET /api/queue-status: Check the status of the BullMQ queue.
# Frontend
Next.js 15.x and React 18.x for building the frontend application.
Real-time Dashboard: Display real-time updates via WebSocket (/api/live-stats).
Log File Upload: Provide an interface for uploading log files.
Supabase Authentication: Handle user authentication with Supabase (email/password and OAuth).
Database and Authentication
Supabase for storing log stats and uploaded files.
Supabase Auth for securing API routes with JWT tokens.
# Real-Time Updates
WebSocket: Real-time updates on job progress and completion using WebSocket connections.
# Docker Deployment
Dockerfile for the Next.js app.
docker-compose.yml to orchestrate Next.js, Redis, and Supabase containers.
Setup Instructions
# Prerequisites
Node.js 20.x (Make sure you have Node.js 20.x installed)
Docker and Docker Compose (For service orchestration)
Supabase Account (For database and authentication)
Redis (For BullMQ job queuing)
# Clone the Repository
git clone https://github.com/habeneyasu/realtime-log-processor
cd your-repo
Set Up Environment Variables
Create a .env file in the backend directory:

DATABASE_URL=your_supabase_db_url
DATABASE_USER=your_supabase_db_user
REDIS_HOST=redis
REDIS_PORT=6379
Create a .env.local file in the frontend directory:


NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Install Dependencies
For the backend:

cd backend
npm install
For the frontend:


cd frontend
npm install
Run with Docker
Start the services using Docker Compose:

docker-compose up
The frontend will be available at http://localhost:3000, and the backend API at http://localhost:4000.

Run Tests
For the backend:

cd backend
npm test
API Endpoints
Backend
POST /api/upload-logs: Upload a log file and enqueue a job.

Returns jobId.
GET /api/stats: Fetch aggregated stats from Supabase.

Returns a list of log stats.
GET /api/stats/[jobId]: Fetch stats for a specific job.

Returns stats for the job identified by jobId.
GET /api/queue-status: Return BullMQ queue status.

Returns the current status of the log processing queue.
# Frontend
WebSocket /api/live-stats: Provides real-time updates for job progress and completion.
# Deliverables
Git Repository: Full source code using Next.js 15.x, React 18.x, and Node.js 20.x.
.env File: Contains configurations for Supabase, Redis, and other necessary environment variables.
Dockerfile: A Dockerfile for building the Next.js app.
docker-compose.yml: Orchestrates Redis, Supabase, and the Next.js app containers.
README.md: Setup instructions, benchmarks, and code walkthrough.
Sample Log File: A 10MB sample log file for testing, placed at backend/logs/large-log-file.log.
Benchmarks
# File Processing: The system should be capable of processing a 1GB log file in under 5 minutes.
# Concurrency: Process 4 jobs concurrently with BullMQ.
What Could Be Improved
Caching
Implement caching mechanisms for frequently accessed stats to improve performance.

# AI Integration
Code Generation: Use AI tools like GitHub Copilot to generate boilerplate code quickly.
Performance Optimization: Utilize AI tools to analyze and optimize performance bottlenecks.
Error Prediction: Implement AI-based error prediction systems to proactively handle job failures and other issues.

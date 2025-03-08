# realtime-log-processor
# realtime-log-processor
Node.js Exercise: Real-Time File Processing Microservice with BullMQ, Next.js, Supabase, and Docker
Objective
Build a full-stack application featuring a Node.js microservice that processes large log files asynchronously using BullMQ, a Next.js frontend with React for real-time analytics, and Supabase for authentication and database storage. Deploy the entire system using Docker. The solution must leverage the latest versions of Next.js (15.x), React (18.x), and Node.js (20.x).

Features
Backend:

Accept log file uploads via a Next.js API route (/api/upload-logs).

Use BullMQ with a Redis-backed queue (log-processing-queue) to process files asynchronously.

Parse log entries using streams and store results in Supabase.

Process 4 jobs concurrently with BullMQ.

API routes for uploading logs, fetching stats, and checking queue status.

Frontend:

Next.js 15.x and React 18.x.

Dashboard with real-time updates via WebSocket (/api/live-stats).

Upload button for log files.

Authentication using Supabase Auth (email/password and OAuth).

Database and Auth:

Supabase for storing log stats and uploaded files.

Secure API routes with Supabase JWT.

Real-Time Updates:

WebSocket connection for broadcasting BullMQ job progress and completion events.

Docker Deployment:

Dockerfile for the Next.js app.

docker-compose.yml to orchestrate Next.js, Redis, and Supabase containers.

Fault Tolerance and Performance:

Handle stream errors and job failures with BullMQ retries.

Optimize for processing a 1GB file under 5 minutes.

Rate-limiting on API routes.

Requirements
Backend (Node.js with BullMQ):

Node.js 20.x.

BullMQ with Redis for job queuing.

Stream-based log parsing.

Supabase for storing log stats.

Frontend (Next.js with React):

Next.js 15.x and React 18.x.

Real-time dashboard with WebSocket updates.

Supabase Auth for user authentication.

Database and Auth (Supabase):

log_stats table in Supabase.

Supabase Storage for uploaded log files.

JWT-based authentication for API routes.

Real-Time Updates:

WebSocket connection for real-time job updates.

Docker Deployment:

Dockerfile for Next.js app.

docker-compose.yml for orchestrating services.

Testing:

Unit tests for log processing logic (Jest).

Integration tests for API routes.

Setup Instructions
Prerequisites
Node.js 20.x

Docker and Docker Compose

Supabase account (for database and authentication)

Redis (for BullMQ)

Steps
Clone the Repository:


git clone https://github.com/habeneyasu/realtime-log-processor
cd your-repo
Set Up Environment Variables:

Create a .env file in the backend directory:

plaintext

DATABASE_URL=your_supabase_db_url
DATABASE_USER=your_supabase_db_user
DATABASE_PASSWORD=your_supabase_db_password
REDIS_HOST=redis
REDIS_PORT=6379
Create a .env.local file in the frontend directory:


NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Install Dependencies:

For the backend:


cd backend
npm install
For the frontend:


cd frontend
npm install
Run with Docker:

Start the services using Docker Compose:


docker-compose up
The frontend will be available at http://localhost:3000, and the backend API at http://localhost:4000.

Run Tests:

For the backend:


cd backend
npm test
API Endpoints
Backend
POST /api/upload-logs:

Upload a log file and enqueue a job.

Returns jobId.

GET /api/stats:

Fetch aggregated stats from Supabase.

GET /api/stats/[jobId]:

Fetch stats for a specific job.

GET /api/queue-status:

Return BullMQ queue status.

Frontend
WebSocket /api/live-stats:

Real-time updates for job progress and completion.

Deliverables
Git Repository:

Full source code using Next.js 15.x, React 18.x, and Node.js 20.x.

.env file for Supabase, Redis, and keyword configs.

Dockerfile and docker-compose.yml.

README.md with setup instructions and benchmarks.

Sample Log File:

A sample 10MB log file for testing.

Loom Recording
Submit a Loom video (10-15 minutes) explaining:

Code:

Walk through the key components (e.g., BullMQ worker, Next.js API, React dashboard).

Challenges:

Discuss obstacles faced (e.g., WebSocket setup, Supabase integration).

Approach:

Explain design decisions (e.g., why you chose a specific BullMQ config).

What Could Be Improved:

Suggest enhancements (e.g., caching, better UI).

(Optional) AI Usage:

How AI tools could improve this (e.g., code generation, optimization).

Benchmarks
File Processing:

Process a 1GB log file under 5 minutes.

Concurrency:

Process 4 jobs concurrently with BullMQ.

What Could Be Improved
Caching:

Implement caching for frequently accessed stats.


AI Integration:

Use AI tools for code optimization and error prediction.

How AI Could Make This More Efficient
Code Generation:

Use AI tools like GitHub Copilot to generate boilerplate code.

Optimization:

Use AI to analyze and optimize performance bottlenecks.

Error Prediction:

Implement AI-based error prediction to proactively handle failures.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Let me know if you need further assistance!

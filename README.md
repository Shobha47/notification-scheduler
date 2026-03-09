Notification Scheduler

A full-stack web application to schedule and manage notifications.
The project consists of a Next.js frontend, Node.js backend, and PostgreSQL database.

Tech Stack

Frontend

Next.js

React.js

Tailwind CSS (if used)

Backend

Node.js

Express.js

Database

PostgreSQL

Project Structure
notification-scheduler
│
├── frontend        # Next.js frontend
├── server          # Node.js backend
└── README.md
Prerequisites

Make sure you have installed:

Node.js (v18 or later recommended)

PostgreSQL

npm or yarn

Git

Clone the Repository
git clone git@github.com:Shobha47/notification-scheduler.git
cd notification-scheduler
Frontend Setup (Next.js)

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Create environment file:

.env.local

Example:

NEXT_PUBLIC_API_URL=http://localhost:5000

Start the development server:

npm run dev

Frontend will run on:

http://localhost:3000
Backend Setup (Node.js)

Navigate to the server folder:

cd server

Install dependencies:

npm install

Create environment file:

.env

Example:

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/notification_db

Start backend server:

npm run dev

Backend will run on:

http://localhost:5000
PostgreSQL Database Setup

Create database:

CREATE DATABASE notification_db;

Update your .env with the correct database credentials.

If using migrations or Prisma, run:

npx prisma migrate dev
Running the Full Project

Start backend:

cd server
npm run dev

Start frontend:

cd frontend
npm run dev

Open browser:

http://localhost:3000
Features

Schedule notifications

View reminder list

Manage pending and triggered reminders

Dashboard with reminder statistics

Author

Shobha Chauhan
Full Stack Developer
React.js | Next.js | Node.js | PostgreSQL
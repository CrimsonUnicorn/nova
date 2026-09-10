# NOVA

NOVA is a full-stack team productivity platform for managing projects, tasks, team members, collaboration, and project progress.

## Features

* User registration and login
* JWT-based authentication
* Protected application routes
* Project creation and management
* Project details and progress tracking
* Project team members
* Task creation and management
* Task status updates
* Task comments and collaboration
* Project progress calculation
* User profile
* Role-based permissions for project/task actions
* Responsive dark-themed interface

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT authentication

## Project Structure

```text
NOVA/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

## Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* A MongoDB database

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd NOVA
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

## Environment Variables

### Server

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use your actual environment variable names if your server currently uses different names.

### Client

If the frontend needs to point to a separately deployed backend, create:

```text
client/.env
```

with:

```env
VITE_API_URL=your_backend_url
```

For local development, this should point to your local backend if required.

**Do not commit `.env` files or secret values to Git.**

## Running Locally

### Start the backend

From `server/`:

```bash
npm run dev
```

### Start the frontend

From `client/`:

```bash
npm run dev
```

The frontend and backend will run separately during development.

## Production Builds

### Frontend

```bash
cd client
npm run build
```

### Backend

```bash
cd server
npm run build
```

Both projects should build successfully before deployment.

## Authentication

NOVA uses JWT-based authentication.

After login, the authentication token is stored on the client and sent with authenticated API requests. Protected routes require a valid authenticated session.

## Main Application Areas

### Dashboard

Provides an overview of projects, total tasks, completed tasks, and project progress.

### Projects

Allows users to create projects and view their existing projects.

### Project Details

Provides project information, team members, tasks, task creation, and project progress.

### Task Details

Provides detailed task information, status management, and comments for collaboration.

### Profile

Displays the authenticated user's account information and provides a logout action.

## API

The backend exposes REST API endpoints for:

* Authentication
* Users
* Projects
* Project members
* Tasks
* Comments
* Project progress
* Health checks

All protected endpoints require authentication.

## Deployment

The application is designed to be deployed as two services:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB

Production environment variables should be configured through the respective deployment platforms rather than committed to the repository.

## Project Status

NOVA is ready for final deployment and production testing.

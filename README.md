# Job Board API

A comprehensive RESTful API for managing a job board platform built with Node.js, Express, and MongoDB. This application supports job postings, candidate applications, employer management, and administrative features.

##  Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Employer, Candidate)
  - Secure password hashing with bcrypt

- **Job Management**
  - Create, read, update, and delete job postings
  - Job types: Full-time, Part-time, Contract, Remote
  - Job filtering and search capabilities
  - Job activation/deactivation

- **Candidate Management**
  - Candidate profiles and resumes
  - Application tracking
  - Notification system

- **Employer Management**
  - Company profiles
  - Job posting management
  - Application review

- **Admin Features**
  - Platform-wide management
  - User moderation
  - System oversight

- **Notifications**
  - Application status updates
  - Job alerts
  - System notifications

##  Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration
- **Development**: nodemon for hot-reloading
- **CORS**: Enabled for cross-origin requests

##  Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- npm or yarn package manager

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/silassdev/super-duper-goggles.git
   cd job-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

   **Required Environment Variables:**
   - `MONGODB_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/job-board` or MongoDB Atlas URI)
   - `JWT_SECRET`: Secret key for JWT token signing (use a strong, random string)
   - `PORT`: Server port (optional, defaults to 3000)

## 🚀 Running the Application

### Development Mode
Run the application with hot-reloading:
```bash
npm run dev
```

### Production Mode
Run the application in production:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

##  API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Jobs (`/api/jobs`)
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (Employer only)
- `PUT /api/jobs/:id` - Update job (Employer only)
- `DELETE /api/jobs/:id` - Delete job (Employer/Admin only)

### Applications (`/api/applications`)
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Submit job application
- `PUT /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

### Candidates (`/api/candidates`)
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate profile
- `POST /api/candidates` - Create candidate profile
- `PUT /api/candidates/:id` - Update candidate profile
- `DELETE /api/candidates/:id` - Delete candidate profile

### Employers (`/api/employers`)
- `GET /api/employers` - Get all employers
- `GET /api/employers/:id` - Get employer profile
- `POST /api/employers` - Create employer profile
- `PUT /api/employers/:id` - Update employer profile
- `DELETE /api/employers/:id` - Delete employer profile

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/:id` - Get specific notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin (`/api/admin`)
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)
- Additional admin management endpoints

##  Project Structure

```
job-board/
├── app.js                  # Application entry point
├── package.json            # Project dependencies and scripts
├── .env                    # Environment variables (not in repo)
├── .gitignore             # Git ignore rules
│
├── models/                # Mongoose data models
│   ├── user.js           # User model (authentication)
│   ├── job.js            # Job posting model
│   ├── application.js    # Job application model
│   ├── candidate.js      # Candidate profile model
│   ├── employer.js       # Employer/company model
│   ├── notification.js   # Notification model
│   └── resume.js         # Resume/CV model
│
├── routes/               # API route handlers
│   ├── auth.js          # Authentication routes
│   ├── jobs.js          # Job management routes
│   ├── applications.js  # Application routes
│   ├── candidates.js    # Candidate routes
│   ├── employers.js     # Employer routes
│   ├── notifications.js # Notification routes
│   ├── admin.js         # Admin routes
│   └── resume.js        # Resume routes
│
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT authentication middleware
│   └── roles.js        # Role-based authorization
│
├── utils/              # Utility functions
│   └── validators.js   # Input validation helpers
│
└── public/            # Static files (if any)
```

##  Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. **Register or login** to receive a JWT token
2. **Include the token** in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### User Roles
- **Admin**: Full system access
- **Employer**: Can manage jobs and view applications
- **Candidate**: Can apply to jobs and manage profile (implied role)

##  Testing

To test the API endpoints, you can use tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- cURL command-line tool


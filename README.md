# SmartAlloc — Institutional Intelligence Engine

A full-stack college room allocation system built with React, Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, React Router, Tailwind CSS   |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |

---

## Project Structure

```
smartalloc/
├── backend/
│   ├── models/         # Mongoose models (User, Room, Course, Allocation)
│   ├── routes/         # Express route handlers
│   ├── middleware/     # JWT auth middleware
│   ├── seed.js         # Demo data seeder
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── pages/      # All page components
        ├── components/ # Sidebar, Header, Layout, ProtectedRoute
        ├── context/    # AuthContext (global auth state)
        └── services/   # Axios API service layer
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js 16+
- MongoDB running locally (or provide a MongoDB Atlas URI)

### 2. Backend

```bash
cd backend
npm install
# Optional: create a .env file
# MONGO_URI=mongodb://localhost:27017/smartalloc
# JWT_SECRET=your_secret_here
# PORT=5001
node server.js
```

The server starts on **http://localhost:5000**.  
On first run, it auto-seeds demo data including users, rooms, courses, and allocations.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The app starts on **http://localhost:3000**.

---

## Demo Login Credentials

| Role          | Username       | Password          |
|---------------|----------------|-------------------|
| Administrator | admin_demo     | smart_alloc_2024  |
| Faculty       | faculty_demo   | faculty_2024      |

---

## Features by Role

### Administrator
- Full Institutional Dashboard with live stats
- Room Management — add, edit, delete rooms; view registry overview
- Course Management — register new courses, view active course index
- Allocation Engine — auto-allocate courses to rooms algorithmically
- Manual Override — assign specific course/room/day/time manually
- Timetable — visual weekly schedule grid
- Conflict Resolution — detect and resolve double-booked rooms
- Performance Intelligence — utilization charts, faculty load, efficiency index
- User Management — add users, manage roles, license allocation tracking
- Settings — profile, notifications, security, system info

### Faculty
- Personalized dashboard with upcoming class schedule
- View rooms and courses
- Timetable view

### Student
- Dashboard view
- Timetable view

---

## API Endpoints

```
POST   /api/auth/login          Sign in
POST   /api/auth/register       Register

GET    /api/rooms               List rooms (with filters)
POST   /api/rooms               Add room (Admin)
PUT    /api/rooms/:id           Update room (Admin)
DELETE /api/rooms/:id           Delete room (Admin)
GET    /api/rooms/stats         Room statistics

GET    /api/courses             List courses
POST   /api/courses             Add course (Admin)
DELETE /api/courses/:id         Delete course (Admin)

GET    /api/allocations         List all allocations
POST   /api/allocations         Create manual allocation
POST   /api/allocations/auto    Run auto-allocation engine
GET    /api/allocations/conflicts  Get all conflicts
PATCH  /api/allocations/:id/resolve  Resolve conflict
DELETE /api/allocations/:id     Remove allocation

GET    /api/users               List users (Admin)
POST   /api/users               Add user (Admin)
PATCH  /api/users/:id/status    Update user status
DELETE /api/users/:id           Delete user

GET    /api/dashboard/stats     Dashboard statistics
GET    /api/dashboard/events    Recent system events
GET    /api/dashboard/utilization  Room utilization by dept
```

---

## Auto-Allocation Algorithm

The engine iterates all unallocated courses and finds the first available room+day+timeslot combination that:
1. Has sufficient capacity for the course's student count
2. Matches the preferred room type
3. Has no time overlap with existing allocations in that room

Conflicts are detected when a room+day+time slot already has a confirmed booking.

---

## Design

- **Aesthetic**: Production-grade institutional SaaS — clean monochrome, Syne typeface
- **Palette**: White/Gray-50 backgrounds, Gray-900 primary actions, semantic color badges
- **Layout**: Fixed sidebar + scrollable main content area
- **Role-based UI**: Sidebar items and page access vary by role

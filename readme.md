<div align="center">

# 📚 StudySync

### Collaborative Study Room Platform for Students

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)
![Socket.io](https://img.shields.io/badge/Socket.IO-4.x-black)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38bdf8)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **Study together, grow together - Real-time collaborative study platform for exam preparation**

[Live Demo](https://studysync-platform.vercel.app/login) • [Report Bug](https://github.com/your-username/study-sync/issues) • [Request Feature](https://github.com/your-username/study-sync/issues)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Socket Events](#-socket-events)
- [Database Schema](#-database-schema)
- [How to Use](#-how-to-use)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

**StudySync** is a real-time collaborative study platform designed to help students prepare for exams and interviews together. It creates a structured, distraction-free environment where users can create virtual study rooms, invite participants, track study sessions, and collaborate in real-time.

### Problem Statement

Students preparing for exams or interviews often struggle to stay consistent while studying alone. Existing communication tools lack focused collaboration and accountability features designed specifically for group study sessions.

### Solution

StudySync provides a complete solution with:
- Virtual study rooms with real-time collaboration
- Shared timer for synchronized study sessions
- Goal setting and achievement tracking
- Real-time chat and collaborative notes
- Session analytics and activity tracking

---

## ✨ Features

### Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🔐 User Authentication | ✅ | Register, Login, Logout with JWT |
| 🚪 Room Management | ✅ | Create, Join, Leave, Delete rooms |
| ⏱️ Study Timer | ✅ | Real-time sync across all participants |
| 🎯 Session Goals | ✅ | Set goals, track progress, get achievements |
| 💬 Real-time Chat | ✅ | Instant messages with typing indicators |
| 📝 Shared Notes | ✅ | Collaborative note-taking with auto-save |
| 👥 Participant List | ✅ | Live online/offline status |
| 📊 Session Summary | ✅ | Detailed analytics after each session |
| 📋 Activity Feed | ✅ | Complete room activity history |
| 🔗 Invite System | ✅ | Share Room ID or invite links |
| 👑 Kick Participant | ✅ | Room owners can remove users |
| 🎨 Responsive Design | ✅ | Works on all devices |

### Additional Features

- 🏆 Goal Achievement Notifications
- 📈 Productivity Score Calculation
- 🔄 Real-time Timer Sync (1-second updates)
- 💾 Auto-save Notes (2-second delay)
- 🔔 Activity Notifications
- 👤 Owner Badge Indicator

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime environment |
| Express.js | 4.x | Web framework |
| MongoDB | 7.x | Database |
| Mongoose | 7.x | ODM for MongoDB |
| Socket.IO | 4.x | Real-time communication |
| JSON Web Token | 9.x | Authentication |
| bcryptjs | 2.x | Password hashing |
| cors | 2.x | Cross-origin resource sharing |
| dotenv | 16.x | Environment variables |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.x | UI library |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| Zustand | 4.x | State management |
| Socket.IO Client | 4.x | WebSocket client |
| Axios | 1.x | HTTP requests |
| Framer Motion | 10.x | Animations |
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Validation |
| React Hot Toast | 2.x | Notifications |
| date-fns | 3.x | Date formatting |
| Recharts | 2.x | Charts |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- npm or yarn package manager

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/study-sync.git
cd study-sync
```

#### 2. Backend Setup
```bash
cd study-room-backend
npm install
```
#### Create a .env file:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/studyroom
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3001
NODE_ENV=development
```

#### 3. Frontend Setup
```bash
cd ../study-room-frontend
npm install
```
#### Create a .env file:
```bash
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

#### 4. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### 5. Run the Application
Open two terminals:

Terminal 1 - Backend:

```bash
cd study-room-backend
npm run dev
```
Terminal 2 - Frontend:

```bash
cd study-room-frontend
npm run dev
```

#### 6. Access the App
Open your browser and navigate to: http://localhost:3001

## 📁 Project Structure

```
📦 study-sync/
│
├── 📁 study-room-backend/                 # Backend Server
│   ├── 📁 src/
│   │   ├── 📁 models/                     # MongoDB Schemas
│   │   │   ├── 📄 User.js
│   │   │   ├── 📄 Room.js
│   │   │   ├── 📄 Session.js
│   │   │   ├── 📄 Message.js
│   │   │   └── 📄 Activity.js
│   │   ├── 📁 controllers/                # Business Logic
│   │   │   ├── 📄 authController.js
│   │   │   ├── 📄 roomController.js
│   │   │   ├── 📄 sessionController.js
│   │   │   ├── 📄 analyticsController.js
│   │   │   └── 📄 activityController.js
│   │   ├── 📁 routes/                     # API Routes
│   │   │   └── 📄 api.js
│   │   ├── 📁 middleware/                 # Custom Middleware
│   │   │   └── 📄 auth.js
│   │   └── 📁 sockets/                    # Socket Handlers
│   │       └── 📄 chatSocket.js
│   ├── 📁 uploads/                        # Uploaded Files
│   ├── 📄 .env                            # Environment Variables
│   ├── 📄 package.json                    # Dependencies
│   └── 📄 server.js                       # Entry Point
│
└── 📁 study-room-frontend/                # Frontend Application
    ├── 📁 src/
    │   ├── 📁 pages/                      # Page Components
    │   │   ├── 📄 Login.jsx
    │   │   ├── 📄 Register.jsx
    │   │   ├── 📄 Dashboard.jsx
    │   │   └── 📄 Room.jsx
    │   ├── 📁 components/                 # Reusable Components
    │   │   ├── 📁 ui/                     # UI Components
    │   │   ├── 📁 layouts/                # Layout Components
    │   │   ├── 📁 rooms/                  # Room Components
    │   │   ├── 📁 chat/                   # Chat Components
    │   │   ├── 📁 timer/                  # Timer Components
    │   │   └── 📁 notes/                  # Notes Components
    │   ├── 📁 store/                      # Zustand State Management
    │   │   ├── 📄 authStore.js
    │   │   ├── 📄 roomStore.js
    │   │   ├── 📄 chatStore.js
    │   │   └── 📄 sessionStore.js
    │   ├── 📁 services/                   # API Services
    │   │   ├── 📄 api.js
    │   │   ├── 📄 auth.service.js
    │   │   ├── 📄 room.service.js
    │   │   ├── 📄 session.service.js
    │   │   └── 📄 socket.service.js
    │   ├── 📁 hooks/                      # Custom React Hooks
    │   │   ├── 📄 useAuth.js
    │   │   └── 📄 useSocket.js
    │   ├── 📄 App.jsx                     # Main App Component
    │   └── 📄 main.jsx                    # Entry Point
    ├── 📄 .env                            # Environment Variables
    ├── 📄 package.json                    # Dependencies
    └── 📄 vite.config.js                  # Vite Configuration
```

## 📡 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-backend-url.onrender.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/register` | Register new user | `{name, email, password}` | `{success, data: {user, token}}` |
| POST | `/auth/login` | Login user | `{email, password}` | `{success, data: {user, token}}` |
| GET | `/auth/me` | Get current user | - | `{success, data: {user}}` |
| POST | `/auth/logout` | Logout user | - | `{success, message}` |

### Room Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/rooms` | Create room | ✅ |
| GET | `/rooms` | Get public rooms | ✅ |
| GET | `/rooms/my-rooms` | Get user's rooms | ✅ |
| GET | `/rooms/:id` | Get room details | ✅ |
| POST | `/rooms/:id/join` | Join room | ✅ |
| POST | `/rooms/:id/leave` | Leave room | ✅ |
| DELETE | `/rooms/:id` | Delete room | ✅ |

### Session Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/rooms/:roomId/sessions/start` | Start study session | ✅ |
| POST | `/sessions/:sessionId/end` | End session | ✅ |
| GET | `/rooms/:roomId/sessions/active` | Get active session | ✅ |
| PUT | `/sessions/:sessionId/goals` | Update session goals | ✅ |
| GET | `/sessions/:sessionId/summary` | Get session summary | ✅ |

### Notes Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/rooms/:roomId/notes` | Get shared notes | ✅ |
| POST | `/rooms/:roomId/notes` | Save shared notes | ✅ |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/dashboard` | Get user dashboard stats | ✅ |
| GET | `/analytics/study-history` | Get study history | ✅ |

### Activity Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/rooms/:roomId/activities` | Get room activities | ✅ |

---

## 📝 Request & Response Examples

### Register User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65a3b5c7d8e9f01234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "stats": {
        "totalStudyTime": 0,
        "totalSessions": 0,
        "totalRoomsCreated": 0
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a3b5c7d8e9f01234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "stats": {
        "totalStudyTime": 0,
        "totalSessions": 0,
        "totalRoomsCreated": 0
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Room

**Request:**
```bash
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Math Study Group",
  "description": "Preparing for final exam",
  "settings": {
    "isPrivate": false,
    "maxParticipants": 10
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "room": {
      "_id": "65a3b5c7d8e9f01234567891",
      "name": "Math Study Group",
      "description": "Preparing for final exam",
      "owner": {
        "_id": "65a3b5c7d8e9f01234567890",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "participants": [
        {
          "user": "65a3b5c7d8e9f01234567890",
          "role": "owner",
          "joinedAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "settings": {
        "isPrivate": false,
        "maxParticipants": 10
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Join Room

**Request:**
```bash
POST /api/rooms/65a3b5c7d8e9f01234567891/join
Authorization: Bearer <token>
Content-Type: application/json

{}
```

**Response:**
```json
{
  "success": true,
  "message": "Joined room successfully",
  "data": {
    "room": {
      "_id": "65a3b5c7d8e9f01234567891",
      "name": "Math Study Group",
      "participants": [...]
    }
  }
}
```

### Start Session

**Request:**
```bash
POST /api/rooms/65a3b5c7d8e9f01234567891/sessions/start
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Study session started",
  "data": {
    "session": {
      "_id": "65a3b5c7d8e9f01234567892",
      "room": "65a3b5c7d8e9f01234567891",
      "startedBy": {
        "_id": "65a3b5c7d8e9f01234567890",
        "name": "John Doe"
      },
      "startTime": "2024-01-15T10:30:00.000Z",
      "status": "active"
    }
  }
}
```

### Update Session Goals

**Request:**
```bash
PUT /api/sessions/65a3b5c7d8e9f01234567892/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Complete chapter 5",
  "targetDuration": 30,
  "targetMessages": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Goals updated successfully",
  "data": {
    "goals": {
      "description": "Complete chapter 5",
      "targetDuration": 30,
      "targetMessages": 10,
      "achieved": false
    }
  }
}
```

### End Session

**Request:**
```bash
POST /api/sessions/65a3b5c7d8e9f01234567892/end
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Study session ended",
  "data": {
    "session": {
      "_id": "65a3b5c7d8e9f01234567892",
      "duration": 25,
      "startTime": "2024-01-15T10:30:00.000Z",
      "endTime": "2024-01-15T10:55:00.000Z"
    }
  }
}
```

### Get Session Summary

**Request:**
```bash
GET /api/sessions/65a3b5c7d8e9f01234567892/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "duration": 25,
    "startTime": "2024-01-15T10:30:00.000Z",
    "endTime": "2024-01-15T10:55:00.000Z",
    "goals": {
      "description": "Complete chapter 5",
      "targetDuration": 30,
      "achieved": false
    },
    "metrics": {
      "messagesCount": 8
    },
    "summary": {
      "productivityScore": 65,
      "participantsCount": 3,
      "achievements": [
        "📚 Completed a 25 minute study session"
      ]
    }
  }
}
```

### Get Dashboard Stats

**Request:**
```bash
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalStudyTime": 120,
      "totalSessions": 5,
      "averageDuration": 24,
      "totalRoomsCreated": 2,
      "activeRoomsCount": 1
    },
    "weeklyAnalytics": [
      {
        "_id": "2024-01-15",
        "totalDuration": 60,
        "sessionsCount": 2
      }
    ],
    "recentActivities": [...],
    "activeRooms": [...]
  }
}
```

### Get Shared Notes

**Request:**
```bash
GET /api/rooms/65a3b5c7d8e9f01234567891/notes
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": "Key concepts from today's session..."
  }
}
```

### Save Shared Notes

**Request:**
```bash
POST /api/rooms/65a3b5c7d8e9f01234567891/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Updated notes with new information..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notes saved successfully",
  "data": {
    "notes": "Updated notes with new information..."
  }
}
```

---

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Room not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error message here"
}
```

---

## 📊 Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |




## 🔌 Socket.IO Events Documentation

### Connection URL
```
Development: http://localhost:3000
Production: https://your-backend-url.onrender.com
```

### Connection Setup

**Client Side:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'your_jwt_token' },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to server');
});
```

---

## 📤 Client → Server Events (Emits)

### Room Events

#### `join_room` - Join a study room

**Emit:**
```javascript
socket.emit('join_room', { roomId: '65a3b5c7d8e9f01234567891' });
```

**Purpose:** User joins a specific room to start collaborating

**Response:** `room_joined` event

---

#### `leave_room` - Leave a study room

**Emit:**
```javascript
socket.emit('leave_room', { roomId: '65a3b5c7d8e9f01234567891' });
```

**Purpose:** User leaves the room

**Response:** `user_left` event to other participants

---

### Chat Events

#### `send_message` - Send a chat message

**Emit:**
```javascript
socket.emit('send_message', { 
  roomId: '65a3b5c7d8e9f01234567891', 
  content: 'Hello everyone!' 
});
```

**Purpose:** Send a message to all participants in the room

**Response:** `new_message` event to all room participants

---

#### `typing` - Typing indicator

**Emit:**
```javascript
// Start typing
socket.emit('typing', { 
  roomId: '65a3b5c7d8e9f01234567891', 
  isTyping: true 
});

// Stop typing
socket.emit('typing', { 
  roomId: '65a3b5c7d8e9f01234567891', 
  isTyping: false 
});
```

**Purpose:** Show/hide typing indicator for other users

**Response:** `user_typing` event to other participants

---

### Session Events

#### `start_session` - Start study session

**Emit:**
```javascript
socket.emit('start_session', { roomId: '65a3b5c7d8e9f01234567891' });
```

**Purpose:** Start the study timer for all participants

**Response:** `session_started` event to all room participants

---

#### `end_session` - End study session

**Emit:**
```javascript
socket.emit('end_session', { 
  roomId: '65a3b5c7d8e9f01234567891', 
  duration: 1800 
});
```

**Purpose:** End the study session with duration

**Response:** `session_ended` event to all room participants

---

#### `sync_timer` - Sync timer across participants

**Emit:**
```javascript
socket.emit('sync_timer', { 
  roomId: '65a3b5c7d8e9f01234567891', 
  elapsedSeconds: 120 
});
```

**Purpose:** Synchronize timer value across all participants

**Response:** `timer_sync` event to other participants

---

### Goal Events

#### `update_session_goals` - Update session goals

**Emit:**
```javascript
socket.emit('update_session_goals', {
  roomId: '65a3b5c7d8e9f01234567891',
  sessionId: '65a3b5c7d8e9f01234567892',
  goals: {
    description: 'Complete chapter 5',
    targetDuration: 30,
    targetMessages: 10
  }
});
```

**Purpose:** Update study goals for the session

**Response:** `session_goals_updated` event to all participants

---

#### `goal_achieved` - Notify goal achievement

**Emit:**
```javascript
socket.emit('goal_achieved', {
  roomId: '65a3b5c7d8e9f01234567891',
  userName: 'John Doe',
  goal: 'Complete chapter 5'
});
```

**Purpose:** Notify all participants that a goal was achieved

**Response:** `goal_achieved` event to all participants

---

### Notes Events

#### `update_notes` - Update shared notes

**Emit:**
```javascript
socket.emit('update_notes', {
  roomId: '65a3b5c7d8e9f01234567891',
  notes: 'These are the shared study notes...',
  updatedBy: 'John Doe'
});
```

**Purpose:** Update collaborative notes for the room

**Response:** `notes_updated` event to all participants

---

### Moderation Events

#### `kick_participant` - Kick a participant

**Emit:**
```javascript
socket.emit('kick_participant', {
  roomId: '65a3b5c7d8e9f01234567891',
  userId: '65a3b5c7d8e9f01234567893',
  userName: 'Jane Smith'
});
```

**Purpose:** Remove a participant from the room (owner only)

**Response:** `user_kicked` and `kicked_from_room` events

---

## 📥 Server → Client Events (On)

### Connection Events

#### `connect` - Socket connected

**Listen:**
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});
```

**Payload:** None

---

#### `disconnect` - Socket disconnected

**Listen:**
```javascript
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

**Payload:** None

---

### Room Events

#### `room_joined` - Successfully joined room

**Listen:**
```javascript
socket.on('room_joined', (data) => {
  console.log('Joined room:', data.roomId);
  console.log('Participants:', data.participants);
});
```

**Payload:**
```json
{
  "success": true,
  "roomId": "65a3b5c7d8e9f01234567891",
  "participants": [
    {
      "userId": "65a3b5c7d8e9f01234567890",
      "userName": "John Doe",
      "socketId": "xxx"
    }
  ]
}
```

---

#### `participants_update` - Updated participant list

**Listen:**
```javascript
socket.on('participants_update', (data) => {
  console.log('Participants:', data.participants);
  console.log('Total count:', data.totalCount);
});
```

**Payload:**
```json
{
  "participants": [
    {
      "userId": "65a3b5c7d8e9f01234567890",
      "userName": "John Doe",
      "socketId": "xxx",
      "joinedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalCount": 3
}
```

---

#### `user_joined` - User joined the room

**Listen:**
```javascript
socket.on('user_joined', (data) => {
  toast.success(`${data.userName} joined the room`);
});
```

**Payload:**
```json
{
  "userId": "65a3b5c7d8e9f01234567893",
  "userName": "Jane Smith",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

#### `user_left` - User left the room

**Listen:**
```javascript
socket.on('user_left', (data) => {
  toast.info(`${data.userName} left the room`);
});
```

**Payload:**
```json
{
  "userId": "65a3b5c7d8e9f01234567893",
  "userName": "Jane Smith",
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

### Chat Events

#### `new_message` - New chat message received

**Listen:**
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
  addMessage(data.message);
});
```

**Payload:**
```json
{
  "message": {
    "_id": "65a3b5c7d8e9f01234567894",
    "content": "Hello everyone!",
    "user": {
      "_id": "65a3b5c7d8e9f01234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "room": "65a3b5c7d8e9f01234567891"
  },
  "roomId": "65a3b5c7d8e9f01234567891"
}
```

---

#### `user_typing` - User typing indicator

**Listen:**
```javascript
socket.on('user_typing', (data) => {
  if (data.isTyping) {
    console.log(`${data.userName} is typing...`);
  } else {
    console.log(`${data.userName} stopped typing`);
  }
});
```

**Payload:**
```json
{
  "userId": "65a3b5c7d8e9f01234567893",
  "userName": "Jane Smith",
  "isTyping": true,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Session Events

#### `session_started` - Study session started

**Listen:**
```javascript
socket.on('session_started', (data) => {
  console.log('Session started:', data.sessionId);
  toast.success('Study session started!');
  startTimer();
});
```

**Payload:**
```json
{
  "sessionId": "65a3b5c7d8e9f01234567892",
  "startTime": "2024-01-15T10:30:00.000Z",
  "startedBy": "65a3b5c7d8e9f01234567890",
  "startedByName": "John Doe"
}
```

---

#### `session_ended` - Study session ended

**Listen:**
```javascript
socket.on('session_ended', (data) => {
  console.log('Session ended. Duration:', data.duration);
  toast.success(`Session ended! Duration: ${data.duration} minutes`);
  stopTimer();
});
```

**Payload:**
```json
{
  "sessionId": "65a3b5c7d8e9f01234567892",
  "duration": 25,
  "endedBy": "65a3b5c7d8e9f01234567890",
  "endedByName": "John Doe"
}
```

---

#### `session_active` - Session already active

**Listen:**
```javascript
socket.on('session_active', (data) => {
  console.log('Session already active. Current time:', data.elapsedSeconds);
  updateTimer(data.elapsedSeconds);
});
```

**Payload:**
```json
{
  "sessionId": "65a3b5c7d8e9f01234567892",
  "startTime": "2024-01-15T10:30:00.000Z",
  "elapsedSeconds": 120
}
```

---

#### `timer_sync` - Timer synchronization

**Listen:**
```javascript
socket.on('timer_sync', (data) => {
  console.log('Timer sync:', data.elapsedSeconds);
  updateTimer(data.elapsedSeconds);
});
```

**Payload:**
```json
{
  "elapsedSeconds": 120,
  "syncedBy": "system",
  "timestamp": 1705315200000
}
```

---

### Goal Events

#### `session_goals_updated` - Goals updated

**Listen:**
```javascript
socket.on('session_goals_updated', (data) => {
  console.log('Goals updated by:', data.updatedBy);
  console.log('New goals:', data.goals);
  updateGoals(data.goals);
});
```

**Payload:**
```json
{
  "sessionId": "65a3b5c7d8e9f01234567892",
  "goals": {
    "description": "Complete chapter 5",
    "targetDuration": 30,
    "targetMessages": 10,
    "achieved": false
  },
  "updatedBy": "John Doe",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

#### `goal_achieved` - Goal achieved by participant

**Listen:**
```javascript
socket.on('goal_achieved', (data) => {
  toast.success(`🎉 ${data.userName} achieved the goal: "${data.goal}"! 🎉`);
});
```

**Payload:**
```json
{
  "userName": "John Doe",
  "goal": "Complete chapter 5",
  "timestamp": "2024-01-15T10:55:00.000Z"
}
```

---

### Notes Events

#### `notes_updated` - Shared notes updated

**Listen:**
```javascript
socket.on('notes_updated', (data) => {
  console.log('Notes updated by:', data.updatedBy);
  setNotes(data.notes);
  toast.info(`${data.updatedBy} updated the notes`);
});
```

**Payload:**
```json
{
  "notes": "These are the updated shared notes...",
  "updatedBy": "John Doe",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Moderation Events

#### `user_kicked` - User was kicked

**Listen:**
```javascript
socket.on('user_kicked', (data) => {
  console.log(`${data.userName} was kicked by ${data.kickedBy}`);
  toast.info(`${data.userName} was kicked from the room`);
  
  if (data.userId === currentUserId) {
    // Current user was kicked
    navigate('/dashboard');
  }
});
```

**Payload:**
```json
{
  "userId": "65a3b5c7d8e9f01234567893",
  "userName": "Jane Smith",
  "kickedBy": "John Doe",
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

---

#### `kicked_from_room` - You were kicked

**Listen:**
```javascript
socket.on('kicked_from_room', (data) => {
  toast.error(data.message);
  setTimeout(() => {
    navigate('/dashboard');
  }, 2000);
});
```

**Payload:**
```json
{
  "roomId": "65a3b5c7d8e9f01234567891",
  "message": "You were kicked from the room by John Doe"
}
```

---

### Error Events

#### `error` - Error occurred

**Listen:**
```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data.message);
  toast.error(data.message);
});
```

**Payload:**
```json
{
  "message": "Only room owner can kick participants"
}
```

---

## 🔄 Complete Event Flow Examples

### User Joins Room Flow

```
1. Client → Server: emit('join_room', { roomId })
2. Server → All Clients in room: emit('user_joined', { userId, userName })
3. Server → All Clients in room: emit('participants_update', { participants })
4. Server → Joining Client: emit('room_joined', { success, roomId, participants })
```

### Chat Message Flow

```
1. Client A → Server: emit('send_message', { roomId, content })
2. Server → All Clients in room: emit('new_message', { message, roomId })
```

### Session Timer Flow

```
1. Client A → Server: emit('start_session', { roomId })
2. Server → All Clients in room: emit('session_started', { sessionId, startTime })
3. Server → All Clients in room (every 1 sec): emit('timer_sync', { elapsedSeconds })
4. Client A → Server: emit('end_session', { roomId, duration })
5. Server → All Clients in room: emit('session_ended', { sessionId, duration })
```

### Goals Flow

```
1. Client A → Server: emit('update_session_goals', { roomId, sessionId, goals })
2. Server → All Clients in room: emit('session_goals_updated', { goals, updatedBy })
3. When goal achieved: Client A → Server: emit('goal_achieved', { roomId, userName, goal })
4. Server → All Clients in room: emit('goal_achieved', { userName, goal })
```

### Notes Flow

```
1. Client A → Server: emit('update_notes', { roomId, notes, updatedBy })
2. Server → All Clients in room: emit('notes_updated', { notes, updatedBy })
```

### Kick Participant Flow

```
1. Client A (Owner) → Server: emit('kick_participant', { roomId, userId, userName })
2. Server → Kicked Client: emit('kicked_from_room', { roomId, message })
3. Server → All Clients in room: emit('user_kicked', { userId, userName, kickedBy })
4. Server → All Clients in room: emit('participants_update', { participants })
```

---

## 🧪 Testing Socket Events

### Using Browser Console

```javascript
// Connect to socket
const socket = io('http://localhost:3000', {
  auth: { token: 'your_jwt_token' }
});

// Join room
socket.emit('join_room', { roomId: 'your_room_id' });

// Send message
socket.emit('send_message', { 
  roomId: 'your_room_id', 
  content: 'Test message' 
});

// Listen for messages
socket.on('new_message', (data) => {
  console.log('Message received:', data);
});
```

### Using Socket.IO Admin UI (Optional)

```bash
# Install socket.io-admin-ui
npm install @socket.io/admin-ui

# Access at: http://localhost:3000/admin
```

---

## 📋 Event Summary Table

| Event Name | Direction | Description |
|------------|-----------|-------------|
| `join_room` | Client → Server | Join a room |
| `leave_room` | Client → Server | Leave a room |
| `send_message` | Client → Server | Send chat message |
| `typing` | Client → Server | Typing indicator |
| `start_session` | Client → Server | Start study session |
| `end_session` | Client → Server | End study session |
| `sync_timer` | Client → Server | Sync timer |
| `update_session_goals` | Client → Server | Update goals |
| `goal_achieved` | Client → Server | Goal achieved |
| `update_notes` | Client → Server | Update notes |
| `kick_participant` | Client → Server | Kick participant |
| `room_joined` | Server → Client | Room joined confirmation |
| `participants_update` | Server → Client | Participant list update |
| `user_joined` | Server → Client | User joined notification |
| `user_left` | Server → Client | User left notification |
| `new_message` | Server → Client | New message received |
| `user_typing` | Server → Client | User typing indicator |
| `session_started` | Server → Client | Session started |
| `session_ended` | Server → Client | Session ended |
| `session_active` | Server → Client | Session already active |
| `timer_sync` | Server → Client | Timer sync |
| `session_goals_updated` | Server → Client | Goals updated |
| `goal_achieved` | Server → Client | Goal achieved |
| `notes_updated` | Server → Client | Notes updated |
| `user_kicked` | Server → Client | User kicked notification |
| `kicked_from_room` | Server → Client | You were kicked |
| `error` | Server → Client | Error message |




## 🗄️ Database Schema Documentation

### Database Overview

- **Database Type:** MongoDB (NoSQL)
- **ODM:** Mongoose
- **Collections:** 5 (Users, Rooms, Sessions, Messages, Activities)

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Users    │────→│    Rooms    │←────│  Sessions   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Messages   │    │ Activities  │    │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 1️⃣ Users Collection

### Schema Definition

```javascript
const userSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  stats: {
    totalStudyTime: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    totalRoomsCreated: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});
```

### Sample Document

```json
{
  "_id": "65a3b5c7d8e9f01234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$...",
  "avatar": "default-avatar.png",
  "isOnline": true,
  "lastSeen": "2024-01-15T10:30:00.000Z",
  "stats": {
    "totalStudyTime": 120,
    "totalSessions": 5,
    "totalRoomsCreated": 2
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Indexes

```javascript
// Unique index on email for fast lookup
db.users.createIndex({ email: 1 }, { unique: true });

// Index for sorting by study time
db.users.createIndex({ "stats.totalStudyTime": -1 });

// Index for sorting by creation date
db.users.createIndex({ createdAt: -1 });
```

---

## 2️⃣ Rooms Collection

### Schema Definition

```javascript
const roomSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    }
  }],
  settings: {
    maxParticipants: {
      type: Number,
      default: 10,
      min: 2,
      max: 50
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    inviteCode: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  sharedNotes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  currentSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    default: null
  },
  stats: {
    totalSessions: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});
```

### Sample Document

```json
{
  "_id": "65a3b5c7d8e9f01234567891",
  "name": "Math Study Group",
  "description": "Preparing for final exam",
  "owner": "65a3b5c7d8e9f01234567890",
  "participants": [
    {
      "user": "65a3b5c7d8e9f01234567890",
      "joinedAt": "2024-01-15T10:30:00.000Z",
      "role": "owner"
    },
    {
      "user": "65a3b5c7d8e9f01234567893",
      "joinedAt": "2024-01-15T10:32:00.000Z",
      "role": "member"
    }
  ],
  "settings": {
    "maxParticipants": 10,
    "isPrivate": false,
    "inviteCode": null
  },
  "sharedNotes": "Key concepts: Calculus derivatives, limits...",
  "status": "active",
  "currentSession": "65a3b5c7d8e9f01234567892",
  "stats": {
    "totalSessions": 3,
    "totalStudyTime": 120
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:55:00.000Z"
}
```

### Indexes

```javascript
// Index for finding rooms by owner
db.rooms.createIndex({ owner: 1, status: 1 });

// Index for text search on room name and description
db.rooms.createIndex({ name: "text", description: "text" });

// Index for finding active rooms
db.rooms.createIndex({ status: 1, "stats.totalSessions": -1 });

// Index for finding invite code (sparse for private rooms)
db.rooms.createIndex({ inviteCode: 1 }, { sparse: true });

// Index for finding user's rooms
db.rooms.createIndex({ "participants.user": 1, status: 1 });
```

---

## 3️⃣ Sessions Collection

### Schema Definition

```javascript
const sessionSchema = {
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  startedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinTime: Date,
    leaveTime: Date,
    duration: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  goals: {
    description: { type: String, default: '' },
    targetDuration: { type: Number, default: 0 },
    targetMessages: { type: Number, default: 0 },
    achieved: { type: Boolean, default: false }
  },
  metrics: {
    messagesCount: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 }
  },
  summary: {
    productivityScore: { type: Number, default: 0 },
    participantsCount: { type: Number, default: 0 },
    messagesPerParticipant: { type: Number, default: 0 },
    achievements: [String],
    keyTopics: [String]
  }
}, {
  timestamps: true
});
```

### Sample Document

```json
{
  "_id": "65a3b5c7d8e9f01234567892",
  "room": "65a3b5c7d8e9f01234567891",
  "startedBy": "65a3b5c7d8e9f01234567890",
  "startTime": "2024-01-15T10:30:00.000Z",
  "endTime": "2024-01-15T10:55:00.000Z",
  "duration": 25,
  "participants": [
    {
      "user": "65a3b5c7d8e9f01234567890",
      "joinTime": "2024-01-15T10:30:00.000Z",
      "leaveTime": "2024-01-15T10:55:00.000Z",
      "duration": 25
    },
    {
      "user": "65a3b5c7d8e9f01234567893",
      "joinTime": "2024-01-15T10:32:00.000Z",
      "leaveTime": "2024-01-15T10:55:00.000Z",
      "duration": 23
    }
  ],
  "status": "ended",
  "goals": {
    "description": "Complete chapter 5",
    "targetDuration": 30,
    "targetMessages": 10,
    "achieved": false
  },
  "metrics": {
    "messagesCount": 8,
    "focusScore": 75
  },
  "summary": {
    "productivityScore": 65,
    "participantsCount": 2,
    "messagesPerParticipant": 4,
    "achievements": ["📚 Completed a 25 minute study session"],
    "keyTopics": ["Calculus", "Derivatives"]
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:55:00.000Z"
}
```

### Indexes

```javascript
// Index for finding room sessions
db.sessions.createIndex({ room: 1, startTime: -1 });

// Index for finding active sessions
db.sessions.createIndex({ status: 1, startTime: 1 });

// Index for finding user sessions
db.sessions.createIndex({ "participants.user": 1, startTime: -1 });
```

---

## 4️⃣ Messages Collection

### Schema Definition

```javascript
const messageSchema = {
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'system', 'join', 'leave'],
    default: 'text'
  },
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});
```

### Sample Document

```json
{
  "_id": "65a3b5c7d8e9f01234567894",
  "room": "65a3b5c7d8e9f01234567891",
  "user": "65a3b5c7d8e9f01234567890",
  "content": "Hello everyone! Ready to study?",
  "type": "text",
  "readBy": [
    {
      "user": "65a3b5c7d8e9f01234567890",
      "readAt": "2024-01-15T10:30:05.000Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Indexes

```javascript
// Index for finding room messages (most recent first)
db.messages.createIndex({ room: 1, createdAt: -1 });

// Index for finding user messages
db.messages.createIndex({ user: 1, createdAt: -1 });
```

---

## 5️⃣ Activities Collection

### Schema Definition

```javascript
const activitySchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  action: {
    type: String,
    enum: [
      'user_registered',
      'user_logged_in',
      'user_logged_out',
      'room_created',
      'room_joined',
      'room_left',
      'session_started',
      'session_ended',
      'message_sent',
      'user_kicked'
    ],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip: String,
  userAgent: String
}, {
  timestamps: true
});
```

### Sample Document

```json
{
  "_id": "65a3b5c7d8e9f01234567895",
  "user": "65a3b5c7d8e9f01234567890",
  "userName": "John Doe",
  "room": "65a3b5c7d8e9f01234567891",
  "action": "session_started",
  "details": {
    "startTime": "2024-01-15T10:30:00.000Z"
  },
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Indexes

```javascript
// Index for finding user activities (most recent first)
db.activities.createIndex({ user: 1, createdAt: -1 });

// Index for finding room activities
db.activities.createIndex({ room: 1, createdAt: -1 });

// TTL index to auto-delete activities after 30 days
db.activities.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

---

## 🔄 Relationships Summary

| Collection | References | Referenced By |
|------------|------------|---------------|
| **Users** | - | Rooms (owner, participants), Sessions (startedBy, participants), Messages (user), Activities (user) |
| **Rooms** | owner (User), participants.user (User), currentSession (Session) | Sessions (room), Messages (room), Activities (room) |
| **Sessions** | room (Room), startedBy (User), participants.user (User) | Activities (session) |
| **Messages** | room (Room), user (User) | - |
| **Activities** | user (User), room (Room), session (Session) | - |

---

## 📈 Aggregation Queries

### Get User Dashboard Stats

```javascript
db.sessions.aggregate([
  {
    $match: {
      'participants.user': ObjectId('user_id'),
      status: 'ended'
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
      totalDuration: { $sum: '$duration' },
      sessionsCount: { $sum: 1 }
    }
  },
  { $sort: { '_id': 1 } }
]);
```

### Get Room Analytics

```javascript
db.sessions.aggregate([
  {
    $match: {
      room: ObjectId('room_id'),
      status: 'ended'
    }
  },
  {
    $group: {
      _id: null,
      totalSessions: { $sum: 1 },
      totalDuration: { $sum: '$duration' },
      avgParticipants: { $avg: { $size: '$participants' } },
      avgProductivity: { $avg: '$summary.productivityScore' }
    }
  }
]);
```

### Get Top Active Users

```javascript
db.sessions.aggregate([
  { $match: { status: 'ended' } },
  { $unwind: '$participants' },
  {
    $group: {
      _id: '$participants.user',
      totalStudyTime: { $sum: '$participants.duration' },
      totalSessions: { $sum: 1 }
    }
  },
  { $sort: { totalStudyTime: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' }
]);
```

---

## 🗑️ Data Retention Policy

| Collection | Retention Period | Cleanup Method |
|------------|-----------------|----------------|
| Users | Permanent | Manual deletion |
| Rooms | Permanent (archived after 30 days) | Status flag |
| Sessions | Permanent | Status flag |
| Messages | Permanent | - |
| Activities | 30 days | TTL index |

---

## 🔒 Data Validation Rules

### Users
- Name: 2-50 characters
- Email: Valid email format
- Password: Minimum 6 characters
- Unique email constraint

### Rooms
- Name: Required, max 100 characters
- Description: Max 500 characters
- Max participants: Between 2-50
- Unique invite code for private rooms

### Sessions
- Duration: Auto-calculated from start/end times
- Status: Active or ended
- Goals: Optional with validation

### Messages
- Content: Required, max 1000 characters
- Type: text, system, join, leave

---

## 📊 Database Statistics Query

```javascript
// Get database statistics
db.stats();

// Get collection sizes
db.users.stats();
db.rooms.stats();
db.sessions.stats();
db.messages.stats();
db.activities.stats();
```

---

## 🔧 Backup & Restore

### Backup

```bash
# Backup entire database
mongodump --uri="mongodb://localhost:27017/studyroom" --out=./backup/

# Backup specific collection
mongodump --uri="mongodb://localhost:27017/studyroom" --collection=users --out=./backup/
```

### Restore

```bash
# Restore entire database
mongorestore --uri="mongodb://localhost:27017/studyroom" ./backup/

# Restore specific collection
mongorestore --uri="mongodb://localhost:27017/studyroom" --collection=users ./backup/users.bson
```



## 🎮 How to Use Guide

### Quick Start Video Walkthrough

> **Estimated setup time:** 5 minutes  
> **Prerequisites:** Node.js, MongoDB, npm/yarn installed

---

## 📱 User Guide

### 1. Creating an Account

**Step 1:** Navigate to the Register page
```
http://localhost:3001/register
```

**Step 2:** Fill in your details
| Field | Description | Example |
|-------|-------------|---------|
| Full Name | Your display name | John Doe |
| Email | Your email address | john@example.com |
| Password | Minimum 6 characters | •••••• |

**Step 3:** Click **Register** button

**✅ Success:** You'll be automatically logged in and redirected to Dashboard

---

### 2. Logging In

**Step 1:** Navigate to Login page
```
http://localhost:3001/login
```

**Step 2:** Enter your credentials
- Email: `john@example.com`
- Password: `••••••`

**Step 3:** Click **Login** button

**✅ Success:** Redirected to Dashboard

---

### 3. Dashboard Overview

After login, you'll see:

```
┌─────────────────────────────────────────────────────────┐
│  📚 StudyRoom                    👋 John Doe  [Logout] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome back, John Doe!                                │
│  Here's your study progress for today                   │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  120     │ │   5      │ │   24     │ │   2      │  │
│  │ Minutes  │ │Sessions  │ │ Average  │ │ Rooms    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Weekly Study Activity Chart           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  Recent Activity │  │   Active Rooms   │           │
│  └──────────────────┘  └──────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

**Dashboard Components:**

| Component | Description |
|-----------|-------------|
| Stats Cards | Total study time, sessions, average duration, rooms created |
| Weekly Chart | Bar chart showing daily study activity |
| Recent Activity | Latest actions in your rooms |
| Active Rooms | List of rooms you're currently in |

---

### 4. Creating a Study Room

**Step 1:** Click **+ Create Room** button

**Step 2:** Fill in room details

```
┌─────────────────────────────────────┐
│     Create New Study Room           │
├─────────────────────────────────────┤
│  Room Name *                        │
│  ┌─────────────────────────────┐   │
│  │ Math Study Group            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Description                        │
│  ┌─────────────────────────────┐   │
│  │ Preparing for final exam    │   │
│  │ covering chapters 1-5       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ☐ Private Room (requires invite)  │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  Create  │  │  Cancel  │       │
│  └──────────┘  └──────────┘       │
└─────────────────────────────────────┘
```

**Step 3:** Click **Create**

**✅ Success:** Room created and you're automatically entered

**Room ID:** A 24-character code appears (e.g., `65a3b5c7d8e9f01234567891`)

---

### 5. Joining a Room

**Method 1 - Using Room ID:**

**Step 1:** Get Room ID from owner

**Step 2:** Click **Join Room** button

**Step 3:** Enter Room ID

```
┌─────────────────────────────────────┐
│      Join Existing Room             │
├─────────────────────────────────────┤
│  Room ID *                          │
│  ┌─────────────────────────────┐   │
│  │ 65a3b5c7d8e9f01234567891    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │ Join     │  │ Cancel   │       │
│  └──────────┘  └──────────┘       │
└─────────────────────────────────────┘
```

**Step 4:** Click **Join**

**Method 2 - Using Invite Link:**

Click the invite link shared by owner (auto-fills Room ID)

**✅ Success:** Room appears in "My Study Rooms" list

---

### 6. Inside a Study Room

#### Room Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Math Study Group                                    [Leave Room]          │
│  Preparing for final exam                                                   │
│  Room ID: 65a3b5c7d8e9f01234567891 📋 Copy                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌───────────────────────────┐   │
│  │ 📚 Study Timer                      │  │ 👥 Participants (3)       │   │
│  │                                     │  │                           │   │
│  │         25:30                       │  │ 🟢 John Doe (You) Owner    │   │
│  │                                     │  │ 🟢 Jane Smith              │   │
│  │ [Start Session]                     │  │ 🟢 Mike Johnson      [Kick]│   │
│  └─────────────────────────────────────┘  └───────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 💬 Chat  │ 📋 Activity Feed  │ 📝 Shared Notes                      │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  John Doe: Hello everyone!                        10:30 AM          │   │
│  │  Jane Smith: Ready to study!                      10:31 AM          │   │
│  │  Mike Johnson: Let's start!                       10:32 AM          │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────┐       │   │
│  │  │ Type a message...                                      [Send]│       │   │
│  │  └─────────────────────────────────────────────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 7. Using the Study Timer

#### Start a Session

**Step 1:** Click **Start Session** button

**Step 2:** Timer begins counting

```
┌─────────────────────────────────────┐
│ 📚 Study Timer                      │
│                                     │
│         00:01 → 00:02 → 00:03...    │
│                                     │
│   [⏸ Pause]    [⏹ End Session]     │
└─────────────────────────────────────┘
```

#### Set Session Goals

**Step 1:** Click **Set Goals** button (appears after session starts)

**Step 2:** Enter goal details

```
┌─────────────────────────────────────┐
│        Set Session Goals            │
├─────────────────────────────────────┤
│  What do you want to achieve?       │
│  ┌─────────────────────────────┐   │
│  │ Complete Chapter 5          │   │
│  └─────────────────────────────┘   │
│                                     │
│  Target Duration (minutes)          │
│  ┌─────────────────────────────┐   │
│  │ 30                          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  Save    │  │ Cancel   │       │
│  └──────────┘  └──────────┘       │
└─────────────────────────────────────┘
```

**Step 3:** Click **Save**

**🎉 When goal is achieved:** You'll see a celebration notification!

```
🎉 Congratulations! You achieved your study goal: "Complete Chapter 5"! 🎉
```

#### End Session

**Step 1:** Click **End Session** button

**Step 2:** Session Summary appears

```
┌─────────────────────────────────────────────────────────┐
│                 🎉 Session Complete! 🎉                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   25 minutes                            │
│                 Total Study Time                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                  65%                             │   │
│  │            Productivity Score                    │   │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📌 Session Goal                                        │
│  Complete Chapter 5                                    │
│  Target: 30 min  |  Actual: 25 min                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │   2          │  │   8          │                   │
│  │ Participants │  │  Messages    │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                         │
│  🏆 Achievements                                        │
│  • 📚 Completed a 25 minute study session              │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   Close Summary                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### 8. Chatting with Participants

#### Send a Message

**Step 1:** Type your message in the input box

**Step 2:** Press **Enter** or click **Send**

**💡 Tip:** Other participants will see `"John Doe is typing..."` while you type

#### View Messages

- **Your messages:** Blue bubbles on the right side
- **Others' messages:** Gray bubbles on the left side
- **Timestamp:** Shows when message was sent

---

### 9. Using Shared Notes

**Step 1:** Click **📝 Shared Notes** tab

**Step 2:** Start typing your notes

```
┌─────────────────────────────────────────────────────────┐
│  📝 Collaborative Notes                                 │
│  Everyone can edit - notes sync in real-time            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Key concepts from today's session:                     │
│                                                         │
│  1. Derivatives - rate of change                        │
│  2. Limits - approaching values                         │
│  3. Continuity - smooth functions                       │
│                                                         │
│  Action items:                                          │
│  - Complete practice problems 1-10                      │
│  - Review chapter summary                               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              ✓ Saved at 10:35 AM                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**✨ Features:**
- Auto-saves every 2 seconds
- All participants see updates instantly
- Notes persist even after leaving room

---

### 10. Managing Participants (Room Owners Only)

#### View Participants

Participant list shows:
- 🟢 Green indicator = Online
- 🔴 Gray indicator = Offline
- 👑 Crown icon = Room Owner

#### Kick a Participant

**Step 1:** Find participant in sidebar

**Step 2:** Click **Kick** button next to their name

**Step 3:** Confirm action

```
┌─────────────────────────────────────┐
│  Are you sure you want to kick      │
│  Jane Smith from the room?          │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │  Yes     │  │  No      │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

**✅ Success:** User is removed from room and notified

---

### 11. Inviting Participants

**Step 1:** Click **Invite** button (owners only)

**Step 2:** Copy Room ID or Invite Link

```
┌─────────────────────────────────────┐
│      Invite to "Math Study Group"   │
├─────────────────────────────────────┤
│  Room ID                            │
│  ┌─────────────────────────────┐   │
│  │ 65a3b5c7d8e9f01234567891   │   │
│  └─────────────────────────────┘   │
│  [Copy]                             │
│                                     │
│  Invite Link                        │
│  ┌─────────────────────────────┐   │
│  │ http://localhost:3001/      │   │
│  │ dashboard?join=65a3b5c7...  │   │
│  └─────────────────────────────┘   │
│  [Copy]                             │
│                                     │
│  💡 How to invite:                  │
│  1. Copy the Room ID or Link        │
│  2. Share with friends              │
│  3. They can join from Dashboard    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │           Done              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Step 3:** Share with friends via chat, email, etc.

---

### 12. Viewing Activity Feed

**Step 1:** Click **📋 Activity Feed** tab

**Step 2:** See all room activities

```
┌─────────────────────────────────────────────────────────┐
│  📋 Room Activity Feed                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🟢 John Doe joined the room                10:30 AM    │
│  ▶️ John Doe started a study session         10:32 AM   │
│  💬 John Doe: "Hello everyone!"              10:33 AM   │
│  💬 Jane Smith: "Ready to study!"            10:34 AM   │
│  🎯 Jane Smith set goal: "Complete Ch 5"     10:35 AM   │
│  ⏹️ John Doe ended the study session         11:00 AM   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 13. Leaving a Room

**Step 1:** Click **Leave Room** button in room header

**Step 2:** Confirm (if session is active, it will be ended automatically)

**✅ Success:** Redirected to Dashboard, room removed from your list

---

### 14. Deleting a Room (Owners Only)

**Step 1:** Go to Dashboard

**Step 2:** Find your room

**Step 3:** Click **Delete** button

**Step 4:** Confirm deletion

```
┌─────────────────────────────────────┐
│  Are you sure you want to delete    │
│  "Math Study Group"?                │
│  This action cannot be undone.      │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │  Delete  │  │ Cancel   │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

**✅ Success:** Room permanently deleted

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Ctrl/Cmd + Enter` | Send message (alternative) |
| `Esc` | Close modals (invite, summary) |
| `Ctrl/Cmd + K` | Focus search (if implemented) |

---

## 📱 Mobile Usage

The app is fully responsive and works on mobile devices:

| Feature | Mobile Behavior |
|---------|-----------------|
| Sidebar | Collapsible menu |
| Chat | Full-width with bottom input |
| Timer | Large, easy-to-tap buttons |
| Tabs | Swipeable between tabs |

---

## ❓ Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Can't connect to server | Ensure backend is running: `cd study-room-backend && npm run dev` |
| Socket connection error | Check if port 3000 is free and backend is running |
| Timer not syncing | Refresh the page or rejoin the room |
| Messages not sending | Check socket status in bottom-right corner |
| Can't join room | Verify Room ID is correct (24 characters) |
| Goal notification not showing | Ensure target duration is set and session is running |

### Getting Help

1. **Check browser console** (F12) for errors
2. **Check backend terminal** for logs
3. **Verify MongoDB is running** `mongosh --eval "db.version()"`
4. **Restart both servers** if issues persist

---

## 🎯 Best Practices

### For Students

✅ **Do:**
- Set realistic study goals
- Take collaborative notes
- Use chat for questions
- End sessions properly to track time

❌ **Don't:**
- Share Room ID publicly (for private rooms)
- Kick participants without reason
- Leave sessions running when not studying

### For Room Owners

✅ **Do:**
- Set clear room descriptions
- Welcome new participants
- Use goals to keep group focused
- Remove inactive participants

❌ **Don't:**
- Abuse kick functionality
- Create too many inactive rooms
- Share invite codes publicly

---

## 📊 Progress Tracking

Your study progress is automatically tracked:

| Metric | How it's calculated |
|--------|---------------------|
| Total Study Time | Sum of all session durations |
| Total Sessions | Number of completed sessions |
| Productivity Score | Based on duration + goal achievement |
| Achievements | Earned for milestones |

---

## 🔔 Notifications

| Event | Notification Type |
|-------|-------------------|
| User joins room | Toast + Activity Feed |
| User leaves room | Toast + Activity Feed |
| New message | Chat bubble + Activity Feed |
| Goal achieved | Toast (all participants) |
| Session started | Toast + Activity Feed |
| Session ended | Toast + Summary modal |
| Kicked from room | Alert + redirect |

---

## 🎉 Success Stories

*"StudySync helped our study group stay focused during exam week. We increased our study time by 40%!"*  
— **Jane, Computer Science Student**

*"The shared notes feature is a game-changer. Everyone contributes, and we never miss important points."*  
— **Mike, Medical Student**

---

## 📞 Need Help?

- **Documentation:** [GitHub Wiki](https://github.com/your-username/study-sync/wiki)
- **Report Bug:** [GitHub Issues](https://github.com/your-username/study-sync/issues)
- **Email Support:** your.email@example.com

---

<div align="center">

**Happy Studying! 📚🎯**

*StudySync - Study together, grow together*

</div>

## 🚀 Deployment Guide

### Deployment Options

| Platform | Backend | Frontend | Difficulty |
|----------|---------|----------|------------|
| **Render + Vercel** | ✅ Free | ✅ Free | Easy |
| **Railway + Netlify** | ✅ Free | ✅ Free | Easy |
| **Heroku + Vercel** | Paid | ✅ Free | Medium |
| **AWS EC2 + S3** | Paid | Paid | Hard |
| **DigitalOcean** | Paid | Paid | Medium |

---

## 📦 Recommended: Render (Backend) + Vercel (Frontend)

### Prerequisites

- [ ] GitHub account
- [ ] MongoDB Atlas account (free tier)
- [ ] Render account (free tier)
- [ ] Vercel account (free tier)

---

## 🗄️ Step 1: Set up MongoDB Atlas (Cloud Database)

### 1.1 Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click **Sign Up** (free)
3. Verify your email

### 1.2 Create Cluster

1. Click **Build a Database**
2. Select **FREE** tier
3. Choose provider (AWS, GCP, or Azure)
4. Select region closest to you
5. Click **Create Cluster** (takes 1-3 minutes)

### 1.3 Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Username: `studysync_user`
4. Password: `SecurePassword123!` (save this!)
5. Privileges: `Read and write to any database`
6. Click **Add User**

### 1.4 Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Confirm**

### 1.5 Get Connection String

1. Go to **Clusters**
2. Click **Connect**
3. Select **Connect your application**
4. Copy the connection string:

```
mongodb+srv://studysync_user:<password>@cluster.mongodb.net/studyroom?retryWrites=true&w=majority
```

5. Replace `<password>` with your actual password

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Prepare Backend for Production

**Update `study-room-backend/package.json`:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Update `study-room-backend/server.js` - Add production port handling:**

```javascript
// At the bottom of the file, ensure it uses the PORT from environment
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 2.2 Push to GitHub

```bash
cd study-room-backend
git init
git add .
git commit -m "Initial commit - Backend"
git branch -M main
git remote add origin https://github.com/your-username/study-sync-backend.git
git push -u origin main
```

### 2.3 Deploy on Render

1. Go to [Render](https://render.com)
2. Sign in with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:

```
Name: study-sync-api
Environment: Node
Build Command: npm install
Start Command: npm start
```

6. Add Environment Variables:

```
Key: PORT
Value: 3000

Key: MONGODB_URI
Value: mongodb+srv://studysync_user:yourpassword@cluster.mongodb.net/studyroom

Key: JWT_SECRET
Value: your_very_strong_secret_key_here_12345

Key: JWT_EXPIRE
Value: 7d

Key: CLIENT_URL
Value: https://study-sync.vercel.app

Key: NODE_ENV
Value: production
```

7. Click **Create Web Service**

8. Wait for deployment (2-3 minutes)

9. Your API URL will be: `https://study-sync-api.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend for Production

**Update `study-room-frontend/.env.production`:**

```env
VITE_API_URL=https://study-sync-api.onrender.com/api
VITE_SOCKET_URL=https://study-sync-api.onrender.com
```

**Update `study-room-frontend/vite.config.js`:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
  },
})
```

### 3.2 Build Frontend Locally (Test)

```bash
cd study-room-frontend
npm run build
```

### 3.3 Deploy to Vercel

**Method 1: Via Vercel CLI**

```bash
npm install -g vercel
vercel --prod
```

Follow prompts:
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `study-sync`
- Directory: `./`
- Override settings: `N`

**Method 2: Via GitHub**

1. Push frontend to GitHub:

```bash
cd study-room-frontend
git init
git add .
git commit -m "Initial commit - Frontend"
git branch -M main
git remote add origin https://github.com/your-username/study-sync-frontend.git
git push -u origin main
```

2. Go to [Vercel](https://vercel.com)
3. Click **Add New** → **Project**
4. Import GitHub repository
5. Configure:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

6. Add Environment Variables:

```
Key: VITE_API_URL
Value: https://study-sync-api.onrender.com/api

Key: VITE_SOCKET_URL
Value: https://study-sync-api.onrender.com
```

7. Click **Deploy**

8. Your frontend URL will be: `https://study-sync.vercel.app`

---

## 🔧 Step 4: Configure CORS for Production

**Update `study-room-backend/server.js` CORS settings:**

```javascript
// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://study-sync.vercel.app',
    'https://study-sync-api.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**Re-deploy backend after this change:**

```bash
git add .
git commit -m "Update CORS for production"
git push
# Render will auto-deploy
```

---

## ✅ Step 5: Verify Deployment

### Backend Health Check

```bash
curl https://study-sync-api.onrender.com/health
```

Expected response:
```json
{"status":"OK","timestamp":"2024-01-15T10:30:00.000Z"}
```

### Frontend Access

Open: `https://study-sync.vercel.app`

### Test Complete Flow

1. ✅ Register new user
2. ✅ Login
3. ✅ Create room
4. ✅ Join room (use Room ID)
5. ✅ Start session
6. ✅ Send message
7. ✅ End session

---

## 📊 Alternative Deployments

### Option A: Deploy Both to Railway

**Backend:**

1. Go to [Railway](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select backend repository
4. Add environment variables (same as Render)
5. Railway auto-deploys

**Frontend:**

```bash
npm install -g railway
railway login
railway up
```

### Option B: Deploy to Heroku (Backend)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create study-sync-api

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Option C: Deploy to Netlify (Frontend)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Backend CI/CD

**Create `.github/workflows/backend.yml`:**

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'study-room-backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### Frontend CI/CD

**Create `.github/workflows/frontend.yml`:**

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'study-room-frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🌍 Domain Setup

### Custom Domain for Backend (Render)

1. Go to Render dashboard
2. Select your web service
3. Click **Settings** → **Custom Domain**
4. Add your domain (e.g., `api.studysync.com`)
5. Update DNS records:

```
Type: CNAME
Name: api
Value: study-sync-api.onrender.com
```

### Custom Domain for Frontend (Vercel)

1. Go to Vercel dashboard
2. Select your project
3. Click **Domains**
4. Add your domain (e.g., `studysync.com`)
5. Update DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 Monitoring & Analytics

### Uptime Monitoring (Free)

1. Go to [Corn Job](https://cron-job.org/en/)
2. Sign up (free tier)
3. Add monitors:

| Type | URL | Interval |
|------|-----|----------|
| HTTP(s) | `https://study-sync-api.onrender.com/health` | 5 minutes |
| HTTP(s) | `https://study-sync.vercel.app` | 5 minutes |

### Error Tracking (Free)

**Add Sentry to Frontend:**

```bash
cd study-room-frontend
npm install @sentry/react
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: "production",
});
```

### Analytics (Free)

**Add Google Analytics to Frontend:**

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔒 Security Checklist

- [ ] Environment variables set in production
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] JWT secret strong and unique
- [ ] MongoDB network access configured
- [ ] Rate limiting enabled
- [ ] Helmet.js headers set
- [ ] Input validation on all endpoints

---

## 📈 Scaling Considerations

### When to Scale

| Metric | Threshold | Action |
|--------|-----------|--------|
| Concurrent users | > 500 | Add more backend instances |
| Database size | > 5GB | Enable sharding |
| Response time | > 500ms | Add caching (Redis) |
| WebSocket connections | > 1000 | Scale Socket.IO horizontally |

### Horizontal Scaling (Backend)

```yaml
# render.yaml
services:
  - type: web
    name: study-sync-api
    env: node
    scale: 2  # Run 2 instances
```

### Database Optimization

```javascript
// Add indexes for frequently queried fields
db.rooms.createIndex({ "participants.user": 1 });
db.sessions.createIndex({ room: 1, startTime: -1 });
```

---

## 🐛 Troubleshooting Deployment

### Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection timeout | Check IP whitelist in Atlas |
| CORS error | Update CORS origins in backend |
| WebSocket connection failed | Ensure transports include 'websocket' |
| Build fails | Check Node version compatibility |
| Environment variables not loading | Restart the service |

### Debug Commands

```bash
# Check backend logs (Render)
# Go to Render dashboard → Logs

# Check frontend logs (Vercel)
vercel logs

# Test API endpoint
curl https://study-sync-api.onrender.com/health

# Test WebSocket
wscat -c wss://study-sync-api.onrender.com/socket.io
```

---

## 📁 Production Environment Variables Summary

### Backend (Render)

```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/studyroom
JWT_SECRET=production_secret_key_32_chars_minimum
JWT_EXPIRE=7d
CLIENT_URL=https://study-sync.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)

```env
VITE_API_URL=https://study-sync-api.onrender.com/api
VITE_SOCKET_URL=https://study-sync-api.onrender.com
```

---

## ✅ Deployment Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] User registration works
- [ ] User login works
- [ ] Room creation works
- [ ] Real-time chat works
- [ ] Study timer syncs across users
- [ ] WebSocket connections established
- [ ] Custom domain configured (optional)

---

<div align="center">

**🎉 Your app is now LIVE! Share it with the world! 🎉**

**[Live Demo](https://studysync-platform.vercel.app/login)** • **[API Status](https://studyroom-api-1ezt.onrender.com/health)**

</div>


















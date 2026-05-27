📚 StudySync - Collaborative Study Room Platform
🎯 Project Overview
StudySync is a real-time collaborative study platform designed to help students prepare for exams and interviews together. It creates a structured, distraction-free environment where users can create virtual study rooms, invite participants, track study sessions, and collaborate in real-time.

✨ Features
Core Features (All Implemented ✅)
🔐 Authentication
User registration with secure password hashing (bcrypt)

JWT-based authentication

Login/Logout functionality

Protected routes with token verification

🚪 Study Room Management
Create public/private study rooms

Join rooms using 24-character Room ID

Leave rooms

Delete rooms (owner only)

Room owner/admin support

Real-time participant list with online status

⏱️ Study Session Timer
Start/end study sessions

Real-time timer synchronization across all participants (1-second updates)

Session duration tracking

Shared timer for all room participants

Persistent timer state for late joiners

🎯 Session Goals & Achievements
Set study goals with target duration

Real-time goal progress tracking

Automatic goal achievement detection

Toast notifications when goals are achieved

Broadcast achievement to all participants

💬 Real-time Chat
Instant messaging with real-time delivery

Typing indicators

Message timestamps

Auto-scroll to latest message

User identification on messages

📊 Session Summary
Detailed session analytics after ending

Productivity score calculation

Goal achievement status

Total study time

Achievements earned

Session start/end timestamps

👥 Participant Management
Real-time participant list updates

Online/offline status indicators

Kick participants (room owners only)

Room owner badge

📝 Collaborative Shared Notes
Real-time collaborative note-taking

Auto-save (2 seconds after typing stops)

Notes persist in database

Visible and editable by all participants

Shows who last updated notes

📋 Activity Feed
Track all room activities

Join/leave notifications

Session start/end logs

Message history

Timestamped activity log

🔗 Invite System
Copy Room ID to clipboard

Generate invite links

Auto-join via URL parameter

Additional Features Implemented
Activity Dashboard: Personal study statistics and analytics

Dark/Light Theme: Automatic theme switching

Responsive Design: Works on desktop, tablet, and mobile

Real-time Sync: Perfect timer synchronization across all users

🛠️ Tech Stack
Backend
Technology	Purpose
Node.js	Runtime environment
Express.js	Web framework
MongoDB	Database
Mongoose	ODM for MongoDB
Socket.IO	Real-time WebSocket communication
JWT	Authentication
bcryptjs	Password hashing
Frontend
Technology	Purpose
React.js	UI library
Tailwind CSS	Styling
Zustand	State management
Socket.IO Client	Real-time client
Axios	HTTP requests
Framer Motion	Animations
React Hook Form	Form handling
Zod	Validation
React Hot Toast	Notifications
📁 Project Structure
text
study-sync/
├── study-room-backend/           # Backend Server
│   ├── src/
│   │   ├── models/              # MongoDB Schemas
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   ├── Session.js
│   │   │   ├── Message.js
│   │   │   └── Activity.js
│   │   ├── controllers/         # Business Logic
│   │   │   ├── authController.js
│   │   │   ├── roomController.js
│   │   │   ├── sessionController.js
│   │   │   ├── analyticsController.js
│   │   │   └── activityController.js
│   │   ├── routes/              # API Routes
│   │   │   └── api.js
│   │   ├── middleware/          # Custom Middleware
│   │   │   └── auth.js
│   │   └── sockets/             # Socket.IO Handlers
│   │       └── chatSocket.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── study-room-frontend/          # Frontend Application
    ├── src/
    │   ├── pages/               # Page Components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Room.jsx
    │   ├── components/          # Reusable Components
    │   │   ├── ui/              # UI Components
    │   │   ├── layouts/         # Layout Components
    │   │   ├── rooms/           # Room Components
    │   │   ├── chat/            # Chat Components
    │   │   ├── timer/           # Timer Components
    │   │   └── notes/           # Notes Components
    │   ├── store/               # Zustand Stores
    │   │   ├── authStore.js
    │   │   ├── roomStore.js
    │   │   ├── chatStore.js
    │   │   └── sessionStore.js
    │   ├── services/            # API Services
    │   │   ├── api.js
    │   │   ├── auth.service.js
    │   │   ├── room.service.js
    │   │   ├── session.service.js
    │   │   └── socket.service.js
    │   ├── hooks/               # Custom Hooks
    │   │   ├── useAuth.js
    │   │   └── useSocket.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── package.json
    └── vite.config.js
🚀 Installation & Setup
Prerequisites
Node.js (v18 or higher)

MongoDB (local or Atlas)

npm or yarn

Step 1: Clone the Repository
bash
git clone https://github.com/your-username/study-sync.git
cd study-sync
Step 2: Backend Setup
bash
cd study-room-backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your values
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/studyroom
# JWT_SECRET=your_super_secret_key
# JWT_EXPIRE=7d
# CLIENT_URL=http://localhost:3001
Step 3: Frontend Setup
bash
cd ../study-room-frontend
npm install

# Create .env file
cp .env.example .env

# Update .env
# VITE_API_URL=http://localhost:3000/api
# VITE_SOCKET_URL=http://localhost:3000
Step 4: Run the Application
Terminal 1 - Backend:

bash
cd study-room-backend
npm run dev
Terminal 2 - Frontend:

bash
cd study-room-frontend
npm run dev
Step 5: Access the Application
Open your browser and navigate to: http://localhost:3001

📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user
POST	/api/auth/logout	Logout user
Rooms
Method	Endpoint	Description
POST	/api/rooms	Create room
GET	/api/rooms	Get public rooms
GET	/api/rooms/my-rooms	Get user's rooms
GET	/api/rooms/:id	Get room details
POST	/api/rooms/:id/join	Join room
POST	/api/rooms/:id/leave	Leave room
DELETE	/api/rooms/:id	Delete room
Sessions
Method	Endpoint	Description
POST	/api/rooms/:roomId/sessions/start	Start session
POST	/api/sessions/:sessionId/end	End session
GET	/api/rooms/:roomId/sessions/active	Get active session
PUT	/api/sessions/:sessionId/goals	Update goals
GET	/api/sessions/:sessionId/summary	Get session summary
Analytics
Method	Endpoint	Description
GET	/api/analytics/dashboard	User dashboard
GET	/api/analytics/study-history	Study history
Notes
Method	Endpoint	Description
GET	/api/rooms/:roomId/notes	Get room notes
POST	/api/rooms/:roomId/notes	Save room notes
🔌 Socket.IO Events
Client → Server Events
Event	Payload	Description
join_room	{ roomId }	Join a room
leave_room	{ roomId }	Leave a room
send_message	{ roomId, content }	Send message
typing	{ roomId, isTyping }	Typing indicator
start_session	{ roomId }	Start study session
end_session	{ roomId, duration }	End session
sync_timer	{ roomId, elapsedSeconds }	Sync timer
update_session_goals	{ roomId, sessionId, goals }	Update goals
goal_achieved	{ roomId, userName, goal }	Goal achieved
update_notes	{ roomId, notes, updatedBy }	Update notes
Server → Client Events
Event	Payload	Description
participants_update	{ participants, totalCount }	Participant list
user_joined	{ userId, userName }	User joined
user_left	{ userId, userName }	User left
new_message	{ message, roomId }	New message
user_typing	{ userId, userName, isTyping }	Typing indicator
session_started	{ sessionId, startTime, startedBy }	Session started
session_ended	{ sessionId, duration, endedBy }	Session ended
timer_sync	{ elapsedSeconds }	Timer sync
session_goals_updated	{ sessionId, goals, updatedBy }	Goals updated
goal_achieved	{ userName, goal }	Goal achieved
notes_updated	{ notes, updatedBy }	Notes updated
session_active	{ sessionId, startTime, elapsedSeconds }	Session active
user_kicked	{ userId, userName, kickedBy }	User kicked
kicked_from_room	{ roomId, message }	Kicked notification
🎮 How to Use
1. Create an Account
Navigate to Register page

Enter name, email, and password

Click Register

2. Login
Enter your credentials

Click Login

3. Create a Study Room
Click "Create Room" button

Enter room name and description

Choose public or private

Click Create

4. Join a Room
Get Room ID from the room owner

Click "Join Room"

Enter the 24-character Room ID

Click Join

5. Start Studying
Click "Enter Room" on any room

Click "Start Session" to begin timer

Set study goals using "Set Goals" button

Chat with participants

Take collaborative notes

End session when done

6. Invite Participants
As room owner, click "Invite" button

Copy Room ID or Invite Link

Share with friends

📊 Database Schema
User Schema
javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isOnline: Boolean,
  lastSeen: Date,
  stats: {
    totalStudyTime: Number,
    totalSessions: Number,
    totalRoomsCreated: Number
  }
}
Room Schema
javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  participants: [{
    user: ObjectId,
    role: String,
    joinedAt: Date
  }],
  settings: {
    maxParticipants: Number,
    isPrivate: Boolean,
    inviteCode: String
  },
  sharedNotes: String,
  status: String
}
Session Schema
javascript
{
  room: ObjectId,
  startedBy: ObjectId,
  startTime: Date,
  endTime: Date,
  duration: Number,
  participants: [{
    user: ObjectId,
    joinTime: Date,
    leaveTime: Date
  }],
  goals: {
    description: String,
    targetDuration: Number,
    achieved: Boolean
  },
  metrics: {
    messagesCount: Number
  },
  summary: {
    productivityScore: Number,
    participantsCount: Number,
    achievements: [String]
  }
}
🧪 Testing
Manual Testing Checklist
Authentication
User can register

User can login

User can logout

Protected routes redirect to login

Rooms
Create public room

Create private room

Join room with valid ID

Join room with invalid ID shows error

Leave room

Delete room (owner only)

Real-time Features
Messages appear instantly in chat

Typing indicators show when users type

Participant list updates when users join/leave

Timer syncs across all participants

Session Features
Start session starts timer

Set goals saves goals

Goal achievement triggers notification

End session shows summary modal

Notes
Notes save automatically

Notes sync across participants

Notes persist after page refresh

🚢 Deployment
Backend Deployment (Render/Railway)
Push code to GitHub

Connect repository to Render/Railway

Set environment variables

Deploy

Frontend Deployment (Vercel/Netlify)
Build the project:

bash
cd study-room-frontend
npm run build
Deploy the dist folder to Vercel/Netlify

Configure environment variables

Environment Variables
Backend (.env):

env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=your_frontend_url
NODE_ENV=production
Frontend (.env):

env
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_backend_socket_url
🔒 Security Features
JWT-based authentication

Password hashing with bcrypt (12 rounds)

Input validation and sanitization

CORS configuration

Helmet.js for security headers

Rate limiting on API routes

Protected Socket.IO connections

MongoDB injection prevention

🎯 Achievements & Milestones
✅ Complete real-time collaboration

✅ Perfect timer synchronization across users

✅ Goal tracking with achievements

✅ Collaborative note-taking

✅ Activity logging and analytics

✅ Production-ready code structure

✅ Responsive design

✅ Clean, modern UI

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Your Name

GitHub: @yourusername

LinkedIn: yourname

🙏 Acknowledgments
Built for collaborative learning and exam preparation

Special thanks to all contributors and testers

Inspired by the need for focused group study tools

📧 Contact
For questions or support, please email: your.email@example.com

🎉 Final Notes
StudySync is a complete, production-ready collaborative study platform that successfully implements all required features:

✅ User Authentication

✅ Study Room Management

✅ Session Timer with Real-time Sync

✅ Room Chat with Typing Indicators

✅ Realtime Room Updates

✅ Activity Dashboard

✅ Session Goals & Achievements

✅ Collaborative Notes

✅ Participant Management

✅ Invite System

Live Demo: [your-live-demo-url]
GitHub Repository: https://github.com/your-username/study-sync
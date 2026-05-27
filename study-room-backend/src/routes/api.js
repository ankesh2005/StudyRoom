import express from 'express';
import { protect } from '../middleware/auth.js';

// Import controllers
import * as authController from '../controllers/authController.js';
import * as roomController from '../controllers/roomController.js';
import * as sessionController from '../controllers/sessionController.js';
import * as analyticsController from '../controllers/analyticsController.js';
import * as activityController from '../controllers/activityController.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.post('/auth/logout', protect, authController.logout);

// Room routes
router.post('/rooms', protect, roomController.createRoom);
router.get('/rooms', protect, roomController.getRooms);
router.get('/rooms/my-rooms', protect, roomController.getMyRooms);
router.get('/rooms/:id', protect, roomController.getRoom);
router.post('/rooms/:id/join', protect, roomController.joinRoom);
router.post('/rooms/:id/leave', protect, roomController.leaveRoom);
router.delete('/rooms/:id', protect, roomController.deleteRoom);

// Session routes
router.post('/rooms/:roomId/sessions/start', protect, sessionController.startSession);
router.post('/sessions/:sessionId/end', protect, sessionController.endSession);
router.get('/rooms/:roomId/sessions/active', protect, sessionController.getActiveSession);
router.get('/rooms/:roomId/sessions', protect, sessionController.getRoomSessions);

// Analytics routes
router.get('/analytics/dashboard', protect, analyticsController.getDashboard);
router.get('/analytics/study-history', protect, analyticsController.getStudyHistory);

// delete routes
router.delete('/rooms/:id', protect, roomController.deleteRoom);

// Activity routes
router.get('/rooms/:roomId/activities', protect, activityController.getRoomActivities);
router.get('/analytics/activities', protect, activityController.getUserActivities);

// Session routes 
router.put('/sessions/:sessionId/goals', protect, sessionController.updateSessionGoals);
router.get('/sessions/:sessionId/summary', protect, sessionController.getSessionSummary);

export default router;
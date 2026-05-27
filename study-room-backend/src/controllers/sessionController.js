import Session from '../models/Session.js';
import Room from '../models/Room.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

// @desc    Start study session
// @route   POST /api/rooms/:roomId/sessions/start
// @access  Private
export const startSession = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user is in room
    const isParticipant = room.participants.some(p => 
      p.user.toString() === req.user._id.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You must join the room first'
      });
    }
    
    // Check if session already active
    if (room.currentSession) {
      const activeSession = await Session.findById(room.currentSession);
      if (activeSession && activeSession.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'A study session is already active in this room'
        });
      }
    }
    
    // Create new session
    const session = await Session.create({
      room: room._id,
      startedBy: req.user._id,
      participants: [{
        user: req.user._id,
        joinTime: new Date()
      }]
    });
    
    // Update room
    room.currentSession = session._id;
    await room.save();
    
    // Populate session data
    await session.populate('startedBy', 'name email');
    await session.populate('participants.user', 'name email');
    
    // Log activity
    await Activity.create({
      user: req.user._id,
      room: room._id,
      session: session._id,
      action: 'session_started',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.json({
      success: true,
      message: 'Study session started',
      data: { session }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error starting session',
      error: error.message
    });
  }
};

// @desc    End study session
// @route   POST /api/sessions/:sessionId/end
// @access  Private
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check if user is authorized
    const room = await Room.findById(session.room);
    const isAuthorized = session.startedBy.toString() === req.user._id.toString() ||
                         room.owner.toString() === req.user._id.toString();
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to end this session'
      });
    }
    
    // End session
    await session.endSession();
    
    // Update room stats
    room.stats.totalSessions += 1;
    room.stats.totalStudyTime += session.duration;
    room.currentSession = null;
    await room.save();
    
    // Update user stats for all participants
    for (const participant of session.participants) {
      await User.findByIdAndUpdate(participant.user, {
        $inc: {
          'stats.totalStudyTime': participant.duration || session.duration,
          'stats.totalSessions': 1
        }
      });
    }
    
    // Log activity
    await Activity.create({
      user: req.user._id,
      room: session.room,
      session: session._id,
      action: 'session_ended',
      details: { duration: session.duration },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.json({
      success: true,
      message: 'Study session ended',
      data: {
        session: {
          _id: session._id,
          duration: session.duration,
          startTime: session.startTime,
          endTime: session.endTime
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error ending session',
      error: error.message
    });
  }
};

// @desc    Get active session in room
// @route   GET /api/rooms/:roomId/sessions/active
// @access  Private
export const getActiveSession = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    if (!room.currentSession) {
      return res.json({
        success: true,
        data: { session: null }
      });
    }
    
    const session = await Session.findById(room.currentSession)
      .populate('startedBy', 'name email')
      .populate('participants.user', 'name email');
    
    res.json({
      success: true,
      data: { session }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active session',
      error: error.message
    });
  }
};

// @desc    Get room sessions history
// @route   GET /api/rooms/:roomId/sessions
// @access  Private
export const getRoomSessions = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sessions = await Session.find({
      room: roomId,
      status: 'ended'
    })
    .populate('startedBy', 'name email')
    .sort('-startTime')
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Session.countDocuments({
      room: roomId,
      status: 'ended'
    });
    
    res.json({
      success: true,
      data: { sessions },
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};
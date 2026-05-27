
import mongoose from 'mongoose';
import Room from '../models/Room.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

// @desc    Create room
// @route   POST /api/rooms
// @access  Private
export const createRoom = async (req, res) => {
  try {
    const { name, description, settings } = req.body;
    
    const room = await Room.create({
      name,
      description: description || '',
      owner: req.user._id,
      participants: [{
        user: req.user._id,
        role: 'owner'
      }],
      settings: settings || {}
    });
    
    // Update user stats
    req.user.stats.totalRoomsCreated += 1;
    await req.user.save();
    
    // Populate owner info
    await room.populate('owner', 'name email');
    
    // Log activity
    await Activity.create({
      user: req.user._id,
      room: room._id,
      action: 'room_created',
      details: { roomName: name },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating room',
      error: error.message
    });
  }
};

// @desc    Get all public rooms
// @route   GET /api/rooms
// @access  Private
export const getRooms = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    
    const query = {
      status: 'active',
      'settings.isPrivate': false
    };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const rooms = await Room.find(query)
      .populate('owner', 'name email')
      .populate('participants.user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Room.countDocuments(query);
    
    res.json({
      success: true,
      data: { rooms },
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
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
export const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID format. Room ID must be a 24-character hex string.'
      });
    }
    
    const room = await Room.findOne({
      _id: id,
      status: 'active'
    })
    .populate('owner', 'name email')
    .populate('participants.user', 'name email isOnline lastSeen');
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if private room and user has access
    if (room.settings.isPrivate) {
      const hasAccess = room.participants.some(p => 
        p.user._id.toString() === req.user._id.toString()
      );
      
      if (!hasAccess && room.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This is a private room.'
        });
      }
    }
    
    res.json({
      success: true,
      data: { room }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room',
      error: error.message
    });
  }
};

// @desc    Join room
// @route   POST /api/rooms/:id/join
// @access  Private
export const joinRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID format. Room ID must be a 24-character hex string.'
      });
    }
    
    const room = await Room.findOne({
      _id: id,
      status: 'active'
    });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if room is private
    if (room.settings.isPrivate) {
      const { inviteCode } = req.body;
      if (!inviteCode || inviteCode !== room.settings.inviteCode) {
        return res.status(403).json({
          success: false,
          message: 'Invalid invite code'
        });
      }
    }
    
    // Check if user already in room
    const alreadyJoined = room.participants.some(p => 
      p.user.toString() === req.user._id.toString()
    );
    
    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You are already in this room'
      });
    }
    
    // Check participant limit
    if (room.participants.length >= room.settings.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Room is full'
      });
    }
    
    // Add user to room
    room.participants.push({
      user: req.user._id,
      joinedAt: new Date(),
      role: 'member'
    });
    await room.save();
    
    // Log activity
    await Activity.create({
      user: req.user._id,
      room: room._id,
      action: 'room_joined',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.json({
      success: true,
      message: 'Joined room successfully',
      data: { room }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error joining room',
      error: error.message
    });
  }
};

// @desc    Leave room
// @route   POST /api/rooms/:id/leave
// @access  Private
export const leaveRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID format'
      });
    }

    const room = await Room.findById(req.params.id);
    
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
      return res.status(400).json({
        success: false,
        message: 'You are not in this room'
      });
    }
    
    // Remove user from participants
    room.participants = room.participants.filter(p => 
      p.user.toString() !== req.user._id.toString()
    );
    
    // If room becomes empty, archive it
    if (room.participants.length === 0) {
      room.status = 'archived';
    }
    
    // If owner leaves, assign new owner
    if (room.owner.toString() === req.user._id.toString() && room.participants.length > 0) {
      room.owner = room.participants[0].user;
      room.participants[0].role = 'owner';
    }
    
    await room.save();
    
    // Log activity
    await Activity.create({
      user: req.user._id,
      room: room._id,
      action: 'room_left',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.json({
      success: true,
      message: 'Left room successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error leaving room',
      error: error.message
    });
  }
};

// @desc    Get user's rooms
// @route   GET /api/rooms/my-rooms
// @access  Private
export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      'participants.user': req.user._id,
      status: 'active'
    })
    .populate('owner', 'name email')
    .populate('participants.user', 'name email')
    .sort('-updatedAt');
    
    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your rooms',
      error: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Owner only)
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID format'
      });
    }
    const room = await Room.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or you are not the owner'
      });
    }
    
    room.status = 'deleted';
    await room.save();
    
    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
};
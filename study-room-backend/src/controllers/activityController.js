import Activity from '../models/Activity.js';
import Room from '../models/Room.js';

// Get activities for a specific room
export const getRoomActivities = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50 } = req.query;
    
    // Check if user has access to this room
    const room = await Room.findOne({
      _id: roomId,
      'participants.user': req.user._id,
      status: 'active'
    });
    
    if (!room) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this room'
      });
    }
    
    const activities = await Activity.find({ room: roomId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      _id: activity._id,
      action: activity.action,
      userName: activity.user?.name || 'Unknown',
      details: activity.details,
      createdAt: activity.createdAt
    }));
    
    res.json({
      success: true,
      data: { activities: formattedActivities }
    });
  } catch (error) {
    console.error('Get room activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities'
    });
  }
};

// Get user's recent activities (for dashboard)
export const getUserActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const activities = await Activity.find({ user: req.user._id })
      .populate('room', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activities'
    });
  }
};
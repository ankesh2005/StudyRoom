import Session from '../models/Session.js';
import Activity from '../models/Activity.js';
import Room from '../models/Room.js';

// @desc    Get user dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user stats
    const stats = req.user.stats;
    
    // Get weekly study data (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const weeklySessions = await Session.aggregate([
      {
        $match: {
          'participants.user': userId,
          startTime: { $gte: last7Days },
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
    
    // Get recent activities
    const recentActivities = await Activity.find({ user: userId })
      .populate('room', 'name')
      .sort('-createdAt')
      .limit(10);
    
    // Get active rooms
    const activeRooms = await Room.find({
      'participants.user': userId,
      status: 'active'
    })
    .populate('participants.user', 'name email')
    .limit(5);
    
    // Calculate average session duration
    const totalSessions = stats.totalSessions;
    const averageDuration = totalSessions > 0 
      ? Math.round(stats.totalStudyTime / totalSessions) 
      : 0;
    
    res.json({
      success: true,
      data: {
        stats: {
          totalStudyTime: stats.totalStudyTime,
          totalSessions: stats.totalSessions,
          averageDuration,
          totalRoomsCreated: stats.totalRoomsCreated,
          activeRoomsCount: activeRooms.length
        },
        weeklyAnalytics: weeklySessions,
        recentActivities,
        activeRooms
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard',
      error: error.message
    });
  }
};

// @desc    Get user study history
// @route   GET /api/analytics/study-history
// @access  Private
export const getStudyHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sessions = await Session.find({
      'participants.user': req.user._id,
      status: 'ended'
    })
    .populate('room', 'name')
    .populate('startedBy', 'name')
    .sort('-startTime')
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Session.countDocuments({
      'participants.user': req.user._id,
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
      message: 'Error fetching study history',
      error: error.message
    });
  }
};
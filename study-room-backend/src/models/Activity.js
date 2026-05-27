import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
      'user_registered', 'user_logged_in', 'user_logged_out',
      'room_created', 'room_joined', 'room_left',
      'session_started', 'session_ended',
      'message_sent'
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

// Indexes
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ room: 1, createdAt: -1 });
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
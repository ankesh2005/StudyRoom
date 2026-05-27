import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
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
    joinTime: {
      type: Date,
      default: Date.now
    },
    leaveTime: Date,
    duration: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  metrics: {
    messagesCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Method to end session
sessionSchema.methods.endSession = async function() {
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 60000);
  this.status = 'ended';
  return await this.save();
};

const Session = mongoose.model('Session', sessionSchema);
export default Session;
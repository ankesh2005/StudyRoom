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
    joinTime: Date,
    leaveTime: Date,
    duration: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  metrics: {
    messagesCount: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 }
  },
  // NEW: Session Goals
  goals: {
    type: {
      description: { type: String, default: '' },
      targetDuration: { type: Number, default: 0 }, // in minutes
      targetMessages: { type: Number, default: 0 },
      achieved: { type: Boolean, default: false }
    },
    default: {}
  },
  // NEW: Session Summary
  summary: {
    type: {
      keyTopics: [String],
      achievements: [String],
      productivityScore: { type: Number, default: 0 },
      participantsCount: { type: Number, default: 0 },
      messagesPerParticipant: { type: Number, default: 0 }
    },
    default: {}
  }
}, {
  timestamps: true
});

// Method to update session goals
sessionSchema.methods.updateGoals = async function(goalData) {
  this.goals = {
    description: goalData.description,
    targetDuration: goalData.targetDuration,
    targetMessages: goalData.targetMessages,
    achieved: false
  };
  return await this.save();
};

// Method to generate session summary
sessionSchema.methods.generateSummary = async function() {
  const totalParticipants = this.participants.length;
  const avgMessagesPerParticipant = totalParticipants > 0 
    ? Math.round(this.metrics.messagesCount / totalParticipants) 
    : 0;
  
  // Calculate productivity score (0-100)
  let productivityScore = 50; // Base score
  
  // Add points for duration
  if (this.duration >= 60) productivityScore += 20;
  else if (this.duration >= 30) productivityScore += 10;
  
  // Add points for messages
  if (this.metrics.messagesCount >= 20) productivityScore += 20;
  else if (this.metrics.messagesCount >= 10) productivityScore += 10;
  
  // Add points for goal achievement
  if (this.goals.achieved) productivityScore += 10;
  
  // Cap at 100
  productivityScore = Math.min(productivityScore, 100);
  
  this.summary = {
    productivityScore,
    participantsCount: totalParticipants,
    messagesPerParticipant: avgMessagesPerParticipant,
    keyTopics: extractKeyTopics(), // You can implement this
    achievements: generateAchievements(this)
  };
  
  return await this.save();
};

// Helper to generate achievements
function generateAchievements(session) {
  const achievements = [];
  
  if (session.duration >= 60) {
    achievements.push('🎯 Studied for over an hour!');
  }
  if (session.metrics.messagesCount >= 20) {
    achievements.push('💬 Active collaboration with 20+ messages');
  }
  if (session.goals.achieved) {
    achievements.push(`🏆 Achieved session goal: ${session.goals.description}`);
  }
  if (session.participants.length >= 3) {
    achievements.push('👥 Great group study session with 3+ participants');
  }
  
  if (achievements.length === 0) {
    achievements.push('📚 Completed a study session');
  }
  
  return achievements;
}

function extractKeyTopics() {
  // This can be enhanced with AI or keyword extraction
  return ['Collaborative Learning', 'Active Participation'];
}

sessionSchema.methods.endSession = async function() {
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 60000);
  this.status = 'ended';
  
  // Check if goals were achieved
  if (this.goals.targetDuration > 0 && this.duration >= this.goals.targetDuration) {
    this.goals.achieved = true;
  }
  if (this.goals.targetMessages > 0 && this.metrics.messagesCount >= this.goals.targetMessages) {
    this.goals.achieved = true;
  }
  
  // Generate summary
  await this.generateSummary();
  
  return await this.save();
};

const Session = mongoose.model('Session', sessionSchema);
export default Session;
import apiClient from './api';

export const activityService = {
  // Get activities for a specific room
  getRoomActivities: async (roomId, limit = 50) => {
    try {
      const response = await apiClient.get(`/rooms/${roomId}/activities?limit=${limit}`);
      return response.data.data.activities;
    } catch (error) {
      console.error('Get room activities error:', error);
      throw error;
    }
  },
  
  // Get user's recent activities (for dashboard)
  getUserActivities: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/analytics/activities?limit=${limit}`);
      return response.data.data.activities;
    } catch (error) {
      console.error('Get user activities error:', error);
      throw error;
    }
  }
};
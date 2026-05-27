import React, { useState, useEffect } from 'react';
import { activityService } from '../../services/activity.service';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export default function ActivityFeed({ roomId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
    
    // Refresh activities every 10 seconds
    const interval = setInterval(loadActivities, 10000);
    return () => clearInterval(interval);
  }, [roomId]);

  const loadActivities = async () => {
    try {
      const data = await activityService.getRoomActivities(roomId, 100);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    const icons = {
      room_created: '🏠',
      room_joined: '🚪',
      room_left: '🚶',
      session_started: '▶️',
      session_ended: '⏹️',
      message_sent: '💬',
      user_registered: '📝',
      user_logged_in: '🔑',
      user_logged_out: '🚪'
    };
    return icons[action] || '📋';
  };

  const getActivityText = (activity) => {
    const time = new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    switch (activity.action) {
      case 'room_created':
        return `You created this room`;
      case 'room_joined':
        return `${activity.userName || 'Someone'} joined the room`;
      case 'room_left':
        return `${activity.userName || 'Someone'} left the room`;
      case 'session_started':
        return `${activity.userName || 'Someone'} started a study session`;
      case 'session_ended':
        const duration = activity.details?.duration || 0;
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        return `${activity.userName || 'Someone'} ended the study session (${mins}m ${secs}s)`;
      case 'message_sent':
        const message = activity.details?.message || '';
        const preview = message.length > 50 ? message.substring(0, 50) + '...' : message;
        return `${activity.userName || 'Someone'}: "${preview}"`;
      default:
        return `${activity.action.replace('_', ' ')}`;
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor((now - activityDate) / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return activityDate.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-700 text-sm">📋 Room Activity Feed</h3>
        <p className="text-xs text-gray-500 mt-0.5">Recent activity in this room</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {activities.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            No activity yet
          </div>
        ) : (
          activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="text-lg">{getActivityIcon(activity.action)}</div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm">
                  {getActivityText(activity)}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {formatDate(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
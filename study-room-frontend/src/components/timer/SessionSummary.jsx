import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import apiClient from '../../services/api';

export default function SessionSummary({ sessionId, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetchSummary();
    }
  }, [sessionId]);

  const fetchSummary = async () => {
    try {
      console.log("Fetching summary for session:", sessionId);
      const response = await apiClient.get(`/sessions/${sessionId}/summary`);
      console.log("Summary data:", response.data);
      
      if (response.data.success) {
        setSummary(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError(error.response?.data?.message || 'Failed to load session summary');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return '0 minutes';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
    }
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading session summary...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center">
            <div className="text-red-600 mb-4">⚠️ Error loading summary</div>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summary) return null;

  const hasGoal = summary.goals?.description;
  const isGoalAchieved = summary.goals?.achieved;
  const timeProgress = summary.goals?.targetDuration > 0 
    ? (summary.duration / summary.goals.targetDuration) * 100 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">🎉 Session Complete! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Duration */}
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {formatDuration(summary.duration)}
            </div>
            <p className="text-gray-500 mt-1">Total Study Time</p>
          </div>

          {/* Productivity Score */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white text-center">
            <div className="text-3xl font-bold">{summary.summary?.productivityScore || 0}%</div>
            <p className="text-sm mt-1">Productivity Score</p>
            <div className="w-full bg-white/30 rounded-full h-2 mt-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${summary.summary?.productivityScore || 0}%` }}
              />
            </div>
          </div>

          {/* Goals Section */}
          {hasGoal && (
            <div className={`p-4 rounded-lg ${isGoalAchieved ? 'bg-green-50 border-2 border-green-400' : 'bg-yellow-50 border-2 border-yellow-400'}`}>
              <h3 className="font-bold mb-2 text-lg flex items-center gap-2">
                {isGoalAchieved ? '🎯✨' : '📌'} Session Goal {isGoalAchieved && '✓ ACHIEVED!'}
              </h3>
              <p className="text-base font-medium mb-3">{summary.goals.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/50 p-2 rounded">
                  <span className="text-gray-600">Target Duration:</span>
                  <span className="font-bold text-blue-600 ml-2">{summary.goals.targetDuration} min</span>
                </div>
                <div className="bg-white/50 p-2 rounded">
                  <span className="text-gray-600">Actual Duration:</span>
                  <span className="font-bold text-green-600 ml-2">{summary.duration} min</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{Math.min(Math.round(timeProgress), 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`rounded-full h-2 transition-all duration-500 ${isGoalAchieved ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(timeProgress, 100)}%` }}
                  />
                </div>
              </div>
              
              {isGoalAchieved && (
                <div className="mt-3 text-green-700 text-sm font-medium bg-green-200 p-2 rounded text-center">
                  🎉 Congratulations! You achieved your study goal! 🎉
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {summary.summary?.participantsCount || 1}
              </div>
              <p className="text-xs text-gray-500">Participants</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {summary.metrics?.messagesCount || 0}
              </div>
              <p className="text-xs text-gray-500">Messages</p>
            </div>
          </div>

          {/* Achievements */}
          {summary.summary?.achievements && summary.summary.achievements.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🏆 Achievements</h3>
              <ul className="space-y-1">
                {summary.summary.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm text-gray-700">• {achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Session Info */}
          <div className="text-xs text-gray-400 text-center pt-2 border-t">
            <p>Started: {new Date(summary.startTime).toLocaleString()}</p>
            <p>Ended: {new Date(summary.endTime).toLocaleString()}</p>
          </div>

          <Button onClick={onClose} className="w-full">
            Close Summary
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
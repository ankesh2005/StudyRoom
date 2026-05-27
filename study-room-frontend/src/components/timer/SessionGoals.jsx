import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import toast from 'react-hot-toast';
import apiClient from '../../services/api';
import { socketService } from '../../services/socket.service';

export default function SessionGoals({ roomId, sessionId, currentGoals, onGoalsUpdated }) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalDescription, setGoalDescription] = useState(currentGoals?.description || '');
  const [targetDuration, setTargetDuration] = useState(currentGoals?.targetDuration || 30);
  const [targetMessages, setTargetMessages] = useState(currentGoals?.targetMessages || 10);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveGoals = async () => {
    if (!goalDescription.trim()) {
      toast.error('Please enter a goal description');
      return;
    }

    if (!sessionId) {
      toast.error('No active session found');
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiClient.put(`/sessions/${sessionId}/goals`, {
        description: goalDescription,
        targetDuration: parseInt(targetDuration),
        targetMessages: parseInt(targetMessages)
      });

      if (response.data.success) {
        // Broadcast goals to all participants
        socketService.emit('update_session_goals', {
          roomId: roomId,
          sessionId: sessionId,
          goals: {
            description: goalDescription,
            targetDuration: parseInt(targetDuration),
            targetMessages: parseInt(targetMessages)
          }
        });
        
        toast.success('Goals saved and shared with all participants!');
        setShowGoalModal(false);
        
        if (onGoalsUpdated) {
          onGoalsUpdated(response.data.data.goals);
        }
      }
    } catch (error) {
      console.error('Save goals error:', error);
      toast.error(error.response?.data?.message || 'Failed to save goals');
    } finally {
      setIsSaving(false);
    }
  };

  if (!sessionId) return null;

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowGoalModal(true)}
        className="gap-1"
      >
        🎯 {currentGoals?.description ? 'Edit Goals' : 'Set Goals'}
      </Button>

      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Set Session Goals</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What do you want to achieve?
                </label>
                <textarea
                  placeholder="e.g., Complete chapter 5, Solve 10 problems..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Messages (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={targetMessages}
                  onChange={(e) => setTargetMessages(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 to disable message goal</p>
              </div>

              {currentGoals?.description && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-800">
                    ✅ Current Goal: {currentGoals.description}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 Goals will be visible to all participants in the room!
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSaveGoals} loading={isSaving} className="flex-1">
                  Save Goals
                </Button>
                <Button variant="outline" onClick={() => setShowGoalModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
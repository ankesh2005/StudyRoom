import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import apiClient from '../../services/api';  // Use apiClient instead of fetch

export default function SharedNotes({ roomId, socketService, userName }) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [savingTimeout, setSavingTimeout] = useState(null);

  useEffect(() => {
    // Load saved notes when component mounts
    loadNotes();
    
    // Listen for notes updates from other participants
    socketService.on('notes_updated', (data) => {
      console.log('Notes updated by:', data.updatedBy);
      if (data.notes !== notes) {
        setNotes(data.notes);
        toast.success(`${data.updatedBy} updated the notes`);
      }
    });
    
    return () => {
      socketService.off('notes_updated');
    };
  }, [roomId]);

  const loadNotes = async () => {
    try {
      console.log('Loading notes for room:', roomId);
      const response = await apiClient.get(`/rooms/${roomId}/notes`);
      console.log('Load notes response:', response.data);
      if (response.data.success && response.data.data.notes) {
        setNotes(response.data.data.notes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      // Don't show error toast for load failures
    }
  };

  const saveNotes = async () => {
    if (!notes.trim()) return;
    
    setIsSaving(true);
    try {
      console.log('Saving notes for room:', roomId);
      const response = await apiClient.post(`/rooms/${roomId}/notes`, { notes });
      console.log('Save notes response:', response.data);
      
      if (response.data.success) {
        setLastSaved(new Date());
        // Broadcast to all participants
        socketService.emit('update_notes', {
          roomId: roomId,
          notes: notes,
          updatedBy: userName
        });
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error(error.response?.data?.message || 'Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    // Auto-save after 2 seconds of no typing
    if (savingTimeout) clearTimeout(savingTimeout);
    const timeout = setTimeout(() => {
      if (newNotes.trim()) {
        saveNotes();
      }
    }, 2000);
    setSavingTimeout(timeout);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-700 text-sm">📝 Collaborative Notes</h3>
        <p className="text-xs text-gray-500 mt-0.5">Everyone can edit - notes sync in real-time</p>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="📝 Take collaborative notes here...
          
Examples:
• Key concepts discussed
• Important formulas
• Questions to research
• Action items for next session"
          className="w-full h-full min-h-[400px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
        
        <div className="flex justify-between items-center mt-3">
          <div className="text-xs text-gray-400">
            {lastSaved && (
              <span>✓ Saved at {formatTime(lastSaved)}</span>
            )}
            {isSaving && <span className="ml-2">Saving...</span>}
          </div>
          <Button onClick={saveNotes} size="sm" disabled={isSaving}>
            💾 Save Now
          </Button>
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Tip: Notes are automatically saved every 2 seconds and shared with all participants!
          </p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export default function InviteModal({ roomId, roomName, onClose }) {
  const inviteLink = `${window.location.origin}/dashboard?join=${roomId}`;
  
  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invite to "{roomName}"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Room ID Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room ID
            </label>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono break-all">
                {roomId}
              </code>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(roomId, 'Room ID copied!')}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Share this ID for others to join directly
            </p>
          </div>

          {/* Invite Link Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invite Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm"
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(inviteLink, 'Invite link copied!')}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Share this link for easy joining
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 How to invite:
              <br/>
              1. Copy the Room ID or Invite Link above
              <br/>
              2. Share with friends
              <br/>
              3. They can join from Dashboard using the ID
            </p>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
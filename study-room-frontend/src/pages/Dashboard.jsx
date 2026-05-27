import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layouts/DashboardLayout'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { useRoomStore } from '../store/roomStore'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { rooms, fetchRooms, createRoom, joinRoom, deleteRoom, isLoading } = useRoomStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDesc, setNewRoomDesc] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('Room name is required')
      return
    }
    
    setIsCreating(true)
    try {
      const roomData = {
        name: newRoomName,
        description: newRoomDesc,
        settings: {
          isPrivate: isPrivate,
          maxParticipants: 10
        }
      }
      
      const newRoom = await createRoom(roomData)
      toast.success(`Room "${newRoom.name}" created successfully!`)
      
      setShowCreateModal(false)
      setNewRoomName('')
      setNewRoomDesc('')
      setIsPrivate(false)
      
      await fetchRooms()
      navigate(`/rooms/${newRoom._id}`)
    } catch (error) {
      console.error('Create room error:', error)
      toast.error(error.response?.data?.message || 'Failed to create room')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!joinRoomId.trim()) {
      toast.error('Room ID is required')
      return
    }
    
    setIsJoining(true)
    try {
      await joinRoom(joinRoomId.trim())
      toast.success('Joined room successfully!')
      setJoinRoomId('')
      setShowJoinModal(false)
      await fetchRooms()
      navigate(`/rooms/${joinRoomId.trim()}`)
    } catch (error) {
      console.error('Join room error:', error)
      toast.error(error.response?.data?.message || 'Failed to join room')
    } finally {
      setIsJoining(false)
    }
  }

  const handleDeleteRoom = async (roomId, roomName) => {
    if (window.confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      try {
        await deleteRoom(roomId)
        toast.success('Room deleted successfully!')
        await fetchRooms() // Refresh the list
      } catch (error) {
        console.error('Delete error:', error)
        toast.error(error.response?.data?.message || 'Failed to delete room')
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your study rooms</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowJoinModal(true)} variant="outline">
              🔗 Join Room
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              ➕ Create Room
            </Button>
          </div>
        </div>

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Study Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Math Study Group"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="What will you study?"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={newRoomDesc}
                    onChange={(e) => setNewRoomDesc(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Private Room (requires invite code)</span>
                  </label>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleCreateRoom} loading={isCreating} className="flex-1">
                    Create Room
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateModal(false)
                      setNewRoomName('')
                      setNewRoomDesc('')
                      setIsPrivate(false)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Join Room Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Join Existing Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room ID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 24-character Room ID"
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ask the room owner for the Room ID
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleJoinRoom} loading={isJoining} className="flex-1">
                    Join Room
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowJoinModal(false)
                      setJoinRoomId('')
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Rooms Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Study Rooms</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rooms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Yet</h3>
                <p className="text-gray-500 mb-4">Create a new room or join an existing one to start studying!</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setShowCreateModal(true)}>Create Room</Button>
                  <Button onClick={() => setShowJoinModal(true)} variant="outline">Join Room</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <Card key={room._id} className="hover:shadow-lg transition-all duration-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">{room.name}</h3>
                      {room.settings?.isPrivate && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">🔒 Private</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {room.description || 'No description provided'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>👥 {room.participants?.length || 0} members</span>
                      <span>📅 {new Date(room.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/rooms/${room._id}`)}
                      >
                        Enter Room
                      </Button>
                      {room.owner?._id === user?._id && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteRoom(room._id, room.name)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    
                    {/* Show Room ID for owner */}
                    {room.owner?._id === user?._id && (
                      <p className="text-xs text-gray-400 mt-3 font-mono">
                        ID: {room._id}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {rooms.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
                <p className="text-sm text-gray-600">Total Rooms</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {rooms.reduce((sum, room) => sum + (room.participants?.length || 0), 0)}
                </div>
                <p className="text-sm text-gray-600">Total Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {rooms.filter(r => r.currentSession).length}
                </div>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
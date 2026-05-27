import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useRoomStore } from '../store/roomStore'
import { useSessionStore } from '../store/sessionStore'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import { socketService } from '../services/socket.service'
import { Button } from '../components/ui/Button'

export default function Room() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { currentRoom, fetchRoom, leaveRoom } = useRoomStore()
  const { elapsedSeconds, isRunning, startSession, endSession, updateTimer } = useSessionStore()
  const { messages, addMessage, clearMessages } = useChatStore()
  const [messageInput, setMessageInput] = useState('')
  const [participants, setParticipants] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (id) {
      fetchRoom(id)
    }
  }, [id])

  // Check if current user is room owner
  useEffect(() => {
    if (currentRoom && user) {
      setIsOwner(currentRoom.owner?._id === user._id)
    }
  }, [currentRoom, user])

  // Setup socket connection
  useEffect(() => {
    if (!token || !id) return

    socketService.connect(token)

    // Connection status check
    const checkInterval = setInterval(() => {
      setSocketConnected(socketService.isSocketConnected())
    }, 1000)

    // Socket event listeners
    socketService.on('participants_update', (data) => {
      console.log('Participants update:', data)
      setParticipants(data.participants || [])
    })

    socketService.on('user_joined', (data) => {
      console.log('User joined:', data)
      toast.success(`${data.userName} joined the room`)
    })

    socketService.on('user_left', (data) => {
      console.log('User left:', data)
      toast.info(`${data.userName} left the room`)
    })

    socketService.on('user_kicked', (data) => {
      console.log('User kicked:', data)
      toast.info(`${data.userName} was kicked by ${data.kickedBy}`)
      if (data.userId === user?._id) {
        toast.error('You were kicked from the room!')
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    })

    socketService.on('kicked_from_room', (data) => {
      toast.error(data.message)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    })

    socketService.on('new_message', (data) => {
      console.log('New message received:', data)
      const messageData = data.message || data
      addMessage(messageData)
      scrollToBottom()
    })

    socketService.on('session_started', (data) => {
      console.log('Session started:', data)
      toast.success('Study session started!')
      startSession(id)
    })

    socketService.on('session_ended', (data) => {
      console.log('Session ended:', data)
      const minutes = Math.floor((data.duration || elapsedSeconds) / 60)
      const seconds = (data.duration || elapsedSeconds) % 60
      toast.success(`Session ended! Duration: ${minutes}m ${seconds}s`)
      endSession()
    })

    socketService.on('timer_sync', (data) => {
      console.log('Timer sync:', data)
      updateTimer(data.elapsedSeconds)
    })

    socketService.on('connect', () => {
      console.log('Socket connected, joining room:', id)
      setSocketConnected(true)
      socketService.emit('join_room', { roomId: id })
    })

    return () => {
      clearInterval(checkInterval)
      socketService.emit('leave_room', { roomId: id })
      socketService.disconnect()
      clearMessages()
    }
  }, [token, id, user])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    if (!socketConnected) {
      toast.error('Connecting to chat...')
      return
    }
    console.log('Sending message:', { roomId: id, content: messageInput })
    socketService.emit('send_message', { roomId: id, content: messageInput })
    setMessageInput('')
  }

  const handleStartSession = () => {
    if (!socketConnected) {
      toast.error('Please wait, connecting to server...')
      return
    }
    console.log('Starting session in room:', id)
    socketService.emit('start_session', { roomId: id })
  }

  const handleEndSession = () => {
    if (!socketConnected) {
      toast.error('Please wait, connecting to server...')
      return
    }
    console.log('Ending session in room:', id)
    socketService.emit('end_session', { roomId: id, duration: elapsedSeconds })
  }

  const handleKickUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to kick ${userName} from the room?`)) {
      socketService.emit('kick_participant', { roomId: id, userId, userName })
      toast.success(`Kicking ${userName}...`)
    }
  }

  const handleLeaveRoom = async () => {
    socketService.emit('leave_room', { roomId: id })
    await leaveRoom(id)
    navigate('/dashboard')
    toast.success('Left room')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Socket Status */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${socketConnected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
          {socketConnected ? '● Connected' : '○ Connecting...'}
        </div>
      </div>

      {/* Header - Fixed height */}
      <header className="bg-white border-b px-6 py-3 shadow-sm flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentRoom.name}</h1>
            <p className="text-xs text-gray-500">{currentRoom.description || 'No description'}</p>
            {isOwner && <p className="text-xs text-blue-600 mt-0.5">👑 Room Owner</p>}
          </div>
          <Button onClick={handleLeaveRoom} variant="outline" size="sm">
            Leave Room
          </Button>
        </div>
      </header>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Side - Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Timer - Compact size */}
          <div className="bg-white border-b px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">📚 Study Timer</span>
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>
              <div className="flex gap-2">
                {!isRunning ? (
                  <Button onClick={handleStartSession} size="sm" disabled={!socketConnected}>
                    ▶ Start
                  </Button>
                ) : (
                  <Button onClick={handleEndSession} variant="destructive" size="sm" disabled={!socketConnected}>
                    ⏹ End
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Chat Container - Takes remaining space with scrolling */}
          <div className="flex-1 flex flex-col p-4 min-h-0">
            <div className="bg-white rounded-lg border shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b bg-gray-50 flex-shrink-0">
                <h3 className="font-semibold text-gray-700 text-sm">💬 Room Chat</h3>
              </div>
              
              {/* Messages Container - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.user?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-1.5 ${
                          msg.user?._id === user?._id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.user?._id !== user?._id && (
                          <p className="text-xs font-semibold mb-0.5 text-blue-600">
                            {msg.user?.name}
                          </p>
                        )}
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <p className="text-xs mt-0.5 opacity-70">
                          {msg.createdAt 
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          }
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="p-3 border-t bg-white flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={socketConnected ? "Type a message..." : "Connecting..."}
                    disabled={!socketConnected}
                    className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <Button onClick={handleSendMessage} disabled={!socketConnected} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Sidebar - Fixed width */}
        <div className="w-72 bg-white border-l flex flex-col flex-shrink-0">
          <div className="p-3 border-b flex-shrink-0">
            <h3 className="font-semibold text-gray-700 text-sm">👥 Participants ({participants.length + 1})</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* Current User */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{user?.name}</p>
                  <p className="text-xs text-green-600">● Online (You)</p>
                </div>
              </div>
              {isOwner && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Owner</span>}
            </div>
            
            {/* Other Participants */}
            {participants.map((p) => (
              <div key={p.userId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {p.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{p.userName}</p>
                    <p className="text-xs text-green-600">● Online</p>
                  </div>
                </div>
                {isOwner && p.userId !== user?._id && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleKickUser(p.userId, p.userName)}
                    className="text-xs h-7 px-2"
                  >
                    Kick
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
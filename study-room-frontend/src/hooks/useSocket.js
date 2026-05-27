import { useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { useRoomStore } from '../store/roomStore'
import { useChatStore } from '../store/chatStore'
import { useSessionStore } from '../store/sessionStore'
import { socketService } from '../services/socket.service'

export const useSocket = () => {
  const { isAuthenticated, token } = useAuthStore()
  const { addParticipant, removeParticipant } = useRoomStore()
  const { addMessage, setTypingStatus } = useChatStore()
  const { updateTimer, startSession, endSession } = useSessionStore()
  const isConnected = useRef(false)

  useEffect(() => {
    if (isAuthenticated && token && !isConnected.current) {
      socketService.connect(token)
      isConnected.current = true
    }

    return () => {
      if (!isAuthenticated) {
        socketService.disconnect()
        isConnected.current = false
      }
    }
  }, [isAuthenticated, token])

  useEffect(() => {
    // Participant events
    socketService.on('participant_online', ({ userId }) => {
      console.log('Participant online:', userId)
    })

    socketService.on('participant_offline', ({ userId }) => {
      console.log('Participant offline:', userId)
    })

    // Chat events
    socketService.on('new_message', ({ message, roomId }) => {
      addMessage(roomId, message)
    })

    socketService.on('user_typing', ({ userId, userName, isTyping }) => {
      setTypingStatus(userId, userName, isTyping)
    })

    // Session events
    socketService.on('session_started', ({ sessionId, startTime, startedBy }) => {
      startSession(sessionId, startTime, startedBy)
    })

    socketService.on('session_ended', ({ sessionId, duration }) => {
      endSession(sessionId, duration)
    })

    socketService.on('timer_sync', ({ elapsedSeconds, roomId }) => {
      updateTimer(roomId, elapsedSeconds)
    })

    return () => {
      const events = [
        'participant_online',
        'participant_offline',
        'new_message',
        'user_typing',
        'session_started',
        'session_ended',
        'timer_sync',
      ]
      events.forEach((event) => {
        socketService.off(event, () => {})
      })
    }
  }, [])

  const joinRoom = useCallback((roomId) => {
    socketService.emit('join_room', { roomId })
  }, [])

  const leaveRoom = useCallback((roomId) => {
    socketService.emit('leave_room', { roomId })
  }, [])

  const sendMessage = useCallback((roomId, content) => {
    socketService.emit('send_message', { roomId, content })
  }, [])

  const sendTyping = useCallback((roomId, isTyping) => {
    socketService.emit('typing', { roomId, isTyping })
  }, [])

  const syncTimer = useCallback((roomId, elapsedSeconds) => {
    socketService.emit('sync_timer', { roomId, elapsedSeconds })
  }, [])

  const startSessionSocket = useCallback((roomId) => {
    socketService.emit('start_session', { roomId })
  }, [])

  const endSessionSocket = useCallback((roomId) => {
    socketService.emit('end_session', { roomId })
  }, [])

  return {
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    syncTimer,
    startSessionSocket,
    endSessionSocket,
  }
}
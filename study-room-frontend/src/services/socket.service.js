import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.token = null
  }

  connect(token) {
    if (!token) {
      console.error('No token provided for socket connection')
      return
    }

    // If already connected with same token, don't reconnect
    if (this.socket && this.isConnected && this.token === token) {
      console.log('Socket already connected')
      return
    }

    // Close existing connection
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }

    this.token = token
    const socketUrl = 'http://localhost:3000'
    
    console.log('Connecting to socket server:', socketUrl)
    
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully')
      this.isConnected = true
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message)
      this.isConnected = false
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      this.isConnected = false
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
      this.isConnected = true
    })
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    } else {
      console.warn('Socket not initialized, cannot listen to event:', event)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      console.log(`Emitting ${event}:`, data)
      this.socket.emit(event, data)
    } else {
      console.warn(`Socket not connected, cannot emit: ${event}. Connected: ${this.isConnected}`)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
      this.token = null
    }
  }

  isSocketConnected() {
    return this.isConnected
  }
}

export const socketService = new SocketService()
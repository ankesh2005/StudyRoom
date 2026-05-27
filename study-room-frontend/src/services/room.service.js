import apiClient from './api'

export const roomService = {
  getRooms: async () => {
    const response = await apiClient.get('/rooms')
    return response.data.data.rooms
  },

  getMyRooms: async () => {
    const response = await apiClient.get('/rooms/my-rooms')
    return response.data.data.rooms
  },

  getRoom: async (roomId) => {
    const response = await apiClient.get(`/rooms/${roomId}`)
    return response.data.data.room
  },

  createRoom: async (roomData) => {
    const response = await apiClient.post('/rooms', roomData)
    return response.data.data.room
  },

  joinRoom: async (roomId, inviteCode) => {
    const response = await apiClient.post(`/rooms/${roomId}/join`, { inviteCode })
    return response.data
  },

  leaveRoom: async (roomId) => {
    const response = await apiClient.post(`/rooms/${roomId}/leave`)
    return response.data
  },
  deleteRoom: async (roomId) => {
    try {
      const response = await apiClient.delete(`/rooms/${roomId}`)
      return response.data
    } catch (error) {
      console.error('Delete room error:', error.response?.data || error.message)
      throw error
    }
  },
}
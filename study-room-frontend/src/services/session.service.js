import apiClient from './api'

export const sessionService = {
  startSession: async (roomId) => {
    const response = await apiClient.post(`/rooms/${roomId}/sessions/start`)
    return response.data.data.session
  },

  endSession: async (sessionId) => {
    const response = await apiClient.post(`/sessions/${sessionId}/end`)
    return response.data.data
  },

  getActiveSession: async (roomId) => {
    const response = await apiClient.get(`/rooms/${roomId}/sessions/active`)
    return response.data.data.session
  },
}
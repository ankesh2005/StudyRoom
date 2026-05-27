import { create } from 'zustand'
import { roomService } from '../services/room.service'

export const useRoomStore = create((set, get) => ({
  currentRoom: null,
  rooms: [],
  participants: [],
  isLoading: false,

  fetchRooms: async () => {
    set({ isLoading: true })
    try {
      const rooms = await roomService.getMyRooms()
      set({ rooms, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  fetchRoom: async (roomId) => {
    set({ isLoading: true })
    try {
      const room = await roomService.getRoom(roomId)
      set({ currentRoom: room, participants: room.participants || [], isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  createRoom: async (data) => {
    set({ isLoading: true })
    try {
      const room = await roomService.createRoom(data)
      set((state) => ({ rooms: [room, ...state.rooms], isLoading: false }))
      return room
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  joinRoom: async (roomId) => {
    set({ isLoading: true })
    try {
      await roomService.joinRoom(roomId)
      await get().fetchRooms()
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  leaveRoom: async (roomId) => {
    set({ isLoading: true })
    try {
      await roomService.leaveRoom(roomId)
      set((state) => ({ rooms: state.rooms.filter((r) => r._id !== roomId), isLoading: false }))
    } catch (error) {
      set({ isLoading: false })
    }
  },
  deleteRoom: async (roomId) => {
    set({ isLoading: true })
    try {
      await roomService.deleteRoom(roomId)
      // Remove from local state
      set((state) => ({ 
        rooms: state.rooms.filter((r) => r._id !== roomId),
        isLoading: false 
      }))
      return true
    } catch (error) {
      console.error('Delete room error:', error)
      set({ isLoading: false })
      throw error
    }
  },
}))
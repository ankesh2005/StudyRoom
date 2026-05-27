import { useEffect } from 'react'
import { useRoomStore } from '../store/roomStore'

export const useRoom = () => {
  const {
    currentRoom,
    rooms,
    participants,
    isLoading,
    error,
    fetchRooms,
    fetchRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    setCurrentRoom,
  } = useRoomStore()

  useEffect(() => {
    fetchRooms()
  }, [])

  return {
    currentRoom,
    rooms,
    participants,
    isLoading,
    error,
    fetchRooms,
    fetchRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    setCurrentRoom,
  }
}
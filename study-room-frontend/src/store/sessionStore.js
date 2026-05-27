import { create } from 'zustand'

export const useSessionStore = create((set, get) => ({
  currentSession: null,
  elapsedSeconds: 0,
  isRunning: false,
  timerInterval: null,

  startSession: async (roomId) => {
    // Clear any existing interval
    if (get().timerInterval) {
      clearInterval(get().timerInterval)
    }
    
    set({ 
      currentSession: { room: roomId, _id: Date.now().toString() },
      isRunning: true,
      elapsedSeconds: 0
    })
    
    // Start timer interval
    const interval = setInterval(() => {
      if (get().isRunning) {
        set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }))
      }
    }, 1000)
    
    set({ timerInterval: interval })
  },

  endSession: async () => {
    // Clear interval
    if (get().timerInterval) {
      clearInterval(get().timerInterval)
    }
    
    const finalDuration = get().elapsedSeconds
    set({ 
      currentSession: null, 
      isRunning: false, 
      elapsedSeconds: 0,
      timerInterval: null
    })
    
    return finalDuration
  },

  updateTimer: (seconds) => {
    set({ elapsedSeconds: seconds })
  },

  pauseTimer: () => {
    set({ isRunning: false })
  },

  resumeTimer: () => {
    set({ isRunning: true })
  },

  resetTimer: () => {
    set({ elapsedSeconds: 0 })
  }
}))
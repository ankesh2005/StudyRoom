import { create } from 'zustand'

export const useSessionStore = create((set, get) => ({
  currentSession: null,
  elapsedSeconds: 0,
  isRunning: false,
  timerInterval: null,
  lastSyncTime: null,

  startSession: async (roomId) => {
    // Clear any existing interval
    if (get().timerInterval) {
      clearInterval(get().timerInterval);
      set({ timerInterval: null });
    }
    
    set({ 
      currentSession: { room: roomId, _id: Date.now().toString() },
      isRunning: true,
    });
    
    // Start local timer
    const interval = setInterval(() => {
      const state = get();
      if (state.isRunning) {
        set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
      }
    }, 1000);
    
    set({ timerInterval: interval, lastSyncTime: Date.now() });
  },

  endSession: async () => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval);
      set({ timerInterval: null });
    }
    
    const finalDuration = get().elapsedSeconds;
    set({ 
      currentSession: null, 
      isRunning: false, 
      elapsedSeconds: 0,
      lastSyncTime: null
    });
    
    return finalDuration;
  },

  updateTimer: (seconds) => {
    // Only update if the difference is significant (more than 2 seconds)
    // This prevents jitter but allows correction
    const currentSeconds = get().elapsedSeconds;
    const diff = Math.abs(seconds - currentSeconds);
    
    if (diff > 2) {
      console.log(`Timer sync: correcting from ${currentSeconds}s to ${seconds}s (diff: ${diff}s)`);
      set({ elapsedSeconds: seconds });
    }
  },

  setRunning: (running) => {
    set({ isRunning: running });
  },

  resetTimer: () => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval);
      set({ timerInterval: null });
    }
    set({ elapsedSeconds: 0, isRunning: false });
  }
}));
// ~/stores/auth.ts
import { defineStore } from 'pinia'

export interface AuthUser {
  _id: string
  email: string
  name: string
  role: string
  mosqueId?: any // can be Object (populated) or string (raw id)
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null
  }),
  actions: {
    setUser(user: AuthUser) {
      this.user = user
    },
    clear() {
      this.user = null
    }
  },
  getters: {
    // ✅ Always return mosqueId as a clean string
    mosqueId: (state) => {
      if (!state.user) return null

      const mosque = state.user.mosqueId
      if (!mosque) return null

      // Case 1: backend returned just the ID
      if (typeof mosque === 'string') return mosque

      // Case 2: backend populated the object
      if (typeof mosque === 'object' && mosque._id) return mosque._id

      return null
    },
    
    // ✅ Expose full mosque object when populated
    mosque: (state) => {
      if (!state.user) return null
      const mosque = state.user.mosqueId
      return typeof mosque === 'object' ? mosque : null
    },

    // ✅ Example: expose role safely
    role: (state) => state.user?.role ?? 'guest'
  },
  persist: true
})

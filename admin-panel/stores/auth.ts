// ~/stores/auth.ts
import { defineStore } from 'pinia'

export interface AuthUser {
  _id: string
  email: string
  name: string
  role: string
  mosqueId?: string
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
  persist: true
})

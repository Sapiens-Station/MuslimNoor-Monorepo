import { useNuxtApp, navigateTo } from 'nuxt/app'
import type { LoginDTO, SignupDTO, UserModel } from '~/interfaces/user.interface'
import { ref } from 'vue'

export function useAuth() {
  const { $axios } = useNuxtApp()

  const profile = ref<UserModel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const signup = async (payload: SignupDTO): Promise<UserModel> => {
    const res = await $axios.post('/auth/register', payload)
    const data = res.data as { access_token: string }
  }

  const login = async (payload: LoginDTO): Promise<{ token: string }> => {
    const res = await $axios.post('/auth/login', payload)
    const data = res.data as { access_token: string }
  
    // Normalize naming so the rest of your app always expects "token"
    const token = data.access_token
  
    if (process.client) {
      localStorage.setItem('token', token)
    }
  
    return { token }
  }
  

  const me = async (): Promise<UserModel | null> => {
    const token = process.client ? localStorage.getItem('token') : null
    if (!token) return null
  
    try {
      const res = await $axios.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data as UserModel
    } catch (err: any) {
      console.error('❌ me() error:', err)
      return null
    }
  }
  

  const logout = () => {
    localStorage.removeItem('token')
    profile.value = null
    navigateTo('/login')
  }

  return { signup, login, me, logout, profile, loading, error }
}

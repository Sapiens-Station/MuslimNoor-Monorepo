import { useNuxtApp, navigateTo } from 'nuxt/app'
import type {
  LoginDTO,
  SignupDTO,
  UserModel,
} from '~/interfaces/user.interface'
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const { $axios } = useNuxtApp()

  const profile = ref<UserModel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const signup = async (payload: SignupDTO): Promise<UserModel | null> => {
    try {
      const res = await $axios.post('/auth/register', payload)
      const data = res.data as { access_token: string }
      const user = await me() // Fetch the user profile after signup
      return user
    } catch (err: any) {
      console.error('❌ signup() error:', err)
      return null
    }
  }

  const login = async (payload: LoginDTO): Promise<UserModel | null> => {
    const response = await $axios.post(
      '/auth/login',
      { email: payload.email, password: payload.password },
      { withCredentials: true }
    )
    const { user } = response.data
    const auth = useAuthStore()
    auth.setUser(user)
    return user
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
    return axios
      .post('/auth/logout', {}, { withCredentials: true })
      .then(() => {
        const auth = useAuthStore()
        auth.clear()
        navigateTo('/login')
      })
  }

  return { signup, login, me, logout, profile, loading, error }
}

import type { LoginDTO, SignupDTO, UserModel } from '~/interfaces/user.interface'

export function useAuth() {
  const { $axios } = useNuxtApp()

  const signup = async (payload: SignupDTO): Promise<UserModel> => {
    const res = await $axios.post('/auth/register', payload)
    return res.data as UserModel
  }

  const login = async (payload: LoginDTO): Promise<{ token: string }> => {
    const res = await $axios.post('/auth/login', payload)
    const data = res.data as { token: string }
    localStorage.setItem('token', data.token)
    return data
  }

  const me = async (): Promise<UserModel> => {
    const res = await $axios.get('/auth/me')
    return res.data as UserModel
  }

  return { signup, login, me }
}

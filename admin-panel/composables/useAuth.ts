import { useRuntimeConfig } from '#app'

interface LoginResponse {
  access_token: string
}

export function useAuth() {
  const login = async (email: string, password: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data, error } = await useFetch<LoginResponse>('/auth/login', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: { email, password },
      })

      if (error.value)
        throw new Error(error.value.data.message || 'Invalid credentials')

      if (data.value?.access_token) {
        localStorage.setItem('token', data.value.access_token)
      } else {
        throw new Error('No token received from server')
      }
    } catch (err) {
      throw err
    }
  }

  return { login }
}

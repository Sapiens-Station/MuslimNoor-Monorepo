import { defineNuxtPlugin, useFetch } from "nuxt/app"

export default defineNuxtPlugin(() => {
    type LoginResponse = { token: string }
    const login = async (email: string, password: string) => {
      const { data, error } = await useFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
  
      if (error.value) throw new Error('Login failed')
      if (data.value?.token) {
        localStorage.setItem('token', data.value.token)
      }
    }
  
    const logout = () => {
      localStorage.removeItem('token')
    }
  
    return {
      provide: {
        auth: {
          login,
          logout,
        },
      },
    }
  })
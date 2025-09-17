import { useFetch, useRuntimeConfig, useState } from 'nuxt/app'
import type { AuthUser } from '~/interfaces/user.interface.ts'

export const useUser = () => {
  const user = useState<AuthUser | null>('user', () => null)

  const fetchUser = async () => {
    // ✅ SSR safety: Skip if not in client
    if (!process.client) return null

    const token = localStorage.getItem('token')
    if (!token) return null

    const { data, error } = await useFetch<AuthUser>('/auth/me', {
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (error.value) {
      console.error('❌ Failed to fetch user:', error.value)
    } else {
      user.value = data.value
    }

    return user.value
  }

  return { user, fetchUser }
}

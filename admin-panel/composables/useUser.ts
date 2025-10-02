import { useRuntimeConfig, useState, useNuxtApp } from '#app'
import type { UserModel, UserUpdateDTO } from '~/interfaces/user.interface'

export const useUser = () => {
  const profile = useState<UserModel | null>('user', () => null)
  const loading = useState<boolean>('userLoading', () => false)
  const error = useState<string>('userError', () => '')

const fetchUser = async () => {
  if (!process.client) return null

  const token = localStorage.getItem('token')
  if (!token) return null

  loading.value = true
  error.value = ''
  try {
    const { $axios } = useNuxtApp()
    const res = await $axios.get('/users/profile') // no need to set headers manually
    profile.value = res.data as UserModel
  } catch (err: any) {
    error.value = err?.message || 'Failed to load user profile'
  } finally {
    loading.value = false
  }
  return profile.value
}


  const updateUser = async (payload: UserUpdateDTO) => {
    if (!process.client) return null

    const token = localStorage.getItem('token')
    if (!token) throw new Error('No token found')

    loading.value = true
    error.value = ''
    try {
      const { $axios } = useNuxtApp()
      const res = await $axios.put('/users/update', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      profile.value = res.data as UserModel
      return profile.value
    } catch (err: any) {
      error.value = err?.message || 'Failed to update profile'
      console.error('❌ updateUser error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, error, fetchUser, updateUser }
}

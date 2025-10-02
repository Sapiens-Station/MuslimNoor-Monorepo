// ~/composables/useJamat.ts
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'

export interface JamatTime {
  prayerName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jumuah'
  iqamaTime: string
  azanTime?: string
}

export interface JamatSchedule {
  _id: string
  mosqueId: string
  date: string
  dayKey: string
  jamatTimes: JamatTime[]
}

export function useJamat() {
  const { $axios } = useNuxtApp()
  const auth = useAuthStore()
  const userMosqueId = auth.mosqueId

  // Public APIs
  const getToday = async (mosqueId: string, date: string) => {
    const res = await $axios.get<JamatSchedule>('/jamat/today', {
      params: { userMosqueId, date },
    })
    console.log('getTenDays Jamat schedule', res.data)
    return res.data
  }

  const getTenDays = async (
    mosqueId: string,
    from: string = new Date().toISOString().split('T')[0]
  ) => {
    const res = await $axios.get<JamatSchedule[]>('/jamat/ten-days', {
      params: { userMosqueId, from },
    })
    return res.data
  }

  // Admin APIs
  const createSchedule = async (payload: {
    mosqueId: string
    date: string
    jamatTimes: JamatTime[]
  }) => {
    const res = await $axios.post<JamatSchedule>('/jamat', payload)
    return res.data
  }

  const updateSchedule = async (
    id: string,
    payload: {
      mosqueId: string
      date: string
      jamatTimes: JamatTime[]
    }
  ) => {
    const res = await $axios.put<JamatSchedule>(`/jamat/${id}`, payload)
    return res.data
  }

  const updatePrayerTime = async (
    id: string,
    payload: {
      prayerName: JamatTime['prayerName']
      iqamaTime: string
    }
  ) => {
    const res = await $axios.patch<JamatSchedule>(
      `/jamat/${id}/prayer`,
      payload
    )
    return res.data
  }

  const autoFill = async (payload: {
    mosqueId: string
    lat: number
    lon: number
    date: string
  }) => {
    const res = await $axios.post<JamatSchedule>('/jamat/auto-fill', payload)
    return res.data
  }

  const deleteSchedule = async (id: string) => {
    const res = await $axios.delete<{ message: string }>(`/jamat/${id}`)
    return res.data
  }

  return {
    getToday,
    getTenDays,
    createSchedule,
    updateSchedule,
    updatePrayerTime,
    autoFill,
    deleteSchedule,
  }
}

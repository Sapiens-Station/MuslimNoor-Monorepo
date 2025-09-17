import { useNuxtApp } from '#app'
import type { MosqueModel } from '~/interfaces/mosque.interface'

export function useMosques() {
  const { $axios } = useNuxtApp()

  const fetchMosques = async (): Promise<MosqueModel[]> => {
    const res = await $axios.get('/mosques')
    return res.data as MosqueModel[]
  }

  return { fetchMosques }
}

import type { DonationInterface } from '@/interfaces/donation.interface'

export function useDonations() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || '/api'

  const fetchDonations = async () => {
    const { data, error } = await useFetch<(DonationInterface & { _id: string })[]>(`${apiBase}/donations`)
    if (error.value) throw new Error('Failed to fetch donations')
    return data.value || []
  }

  const fetchDonationById = async (id: string) => {
    const { data, error } = await useFetch<DonationInterface & { _id: string }>(`${apiBase}/donations/${id}`)
    if (error.value) throw new Error('Donation not found')
    if (!data.value) throw new Error('Donation is null')
    return data.value
  }
  

  const createDonation = async (donation: DonationInterface) => {
    const { data, error } = await useFetch(`${apiBase}/donations`, {
      method: 'POST',
      body: donation
    })
    if (error.value) throw new Error('Failed to create donation')
    return data.value
  }

  const updateDonation = async (id: string, donation: DonationInterface) => {
    const { data, error } = await useFetch(`${apiBase}/donations/${id}`, {
      method: 'PUT',
      body: donation
    })
    if (error.value) throw new Error('Failed to update donation')
    return data.value
  }

  const deleteDonation = async (id: string) => {
    const { error } = await useFetch(`${apiBase}/donations/${id}`, {
      method: 'DELETE'
    })
    if (error.value) throw new Error('Failed to delete donation')
  }

  return {
    fetchDonations,
    fetchDonationById,
    createDonation,
    updateDonation,
    deleteDonation
  }
}

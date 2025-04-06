import type { DonationInterface } from "~/interfaces/donation.interface"

  export function useDonations() {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || '/api'
  
    const fetchDonations = async () => {
      const { data, error } = await useFetch<DonationInterface[]>(`${apiBase}/donations`)
      if (error.value) throw new Error('Failed to fetch donations')
      return data.value || []
    }
  
    const fetchDonationById = async (id: string) => {
      const { data, error } = await useFetch<DonationInterface>(`${apiBase}/donations/${id}`)
      if (error.value) throw new Error('Donation not found')
      return data.value
    }
  
    const createDonation = async (form: DonationInterface) => {
      const { data, error } = await useFetch(`${apiBase}/donations`, {
        method: 'POST',
        body: form
      })
      if (error.value) throw new Error('Failed to create donation')
      return data.value
    }
  
    const updateDonation = async (id: string, form: DonationInterface) => {
      const { data, error } = await useFetch(`${apiBase}/donations/${id}`, {
        method: 'PUT',
        body: form
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
  
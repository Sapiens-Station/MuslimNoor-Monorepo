<script setup lang="ts">
import DonationForm from '@/components/donations/DonationForm.vue'
import { useRouter } from 'vue-router'
import { useDonations } from '@/composables/useDonation'
import type { DonationInterface } from '@/interfaces/donation.interface'

const { createDonation } = useDonations()
const router = useRouter()
const error = ref('')

const handleSubmit = async (form: DonationInterface) => {
  try {
    await createDonation(form)
    router.push('/donations')
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Create Donation</h1>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <DonationForm :on-submit="handleSubmit" submit-label="Create Donation" />
  </div>
</template>

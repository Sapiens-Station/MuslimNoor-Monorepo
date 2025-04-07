<script setup lang="ts">
import { useDonations } from '@/composables/useDonation'
import { useRoute, useRouter } from 'vue-router'
import DonationForm from '@/components/donations/DonationForm.vue'
import type { DonationInterface } from '@/interfaces/donation.interface'

const { fetchDonationById, updateDonation } = useDonations()
const route = useRoute()
const router = useRouter()
const donation = ref<DonationInterface>()
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    donation.value = await fetchDonationById(route.params.id as string)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})

const handleUpdate = async (form: DonationInterface) => {
  try {
    await updateDonation(route.params.id as string, form)
    router.push(`/donations/${route.params.id}`)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Edit Donation</h1>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <DonationForm
      v-if="donation"
      :initial-data="donation"
      :on-submit="handleUpdate"
      submit-label="Update Donation"
    />
  </div>
</template>

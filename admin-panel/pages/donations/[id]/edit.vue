<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useDonations } from '~/composables/useDonation'
import { ref, onMounted } from 'vue'
import DonationForm from '@/components/donations/DonationForm.vue'
import type { DonationInterface } from '~/interfaces/donation.interface.ts'

const route = useRoute()
const router = useRouter()
const { fetchDonationById, updateDonation } = useDonations()

const donation = ref<DonationInterface>()
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    donation.value = await fetchDonationById(route.params.id as string)
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
})

const handleUpdate = async (form: DonationInterface) => {
  try {
    await updateDonation(route.params.id as string, form)
    router.push(`/donations/${route.params.id}`)
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unexpected error occurred.'
    }
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Edit Donation</h1>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <DonationForm v-if="donation" :initial-data="donation" :on-submit="handleUpdate" submit-label="Update" />
  </div>
</template>

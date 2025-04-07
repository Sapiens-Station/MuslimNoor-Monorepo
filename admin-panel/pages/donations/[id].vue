<script setup lang="ts">
import { useDonations } from '@/composables/useDonation'
import { useRoute } from 'vue-router'
import type { DonationInterface } from '@/interfaces/donation.interface'

const { fetchDonationById } = useDonations()
const route = useRoute()
const donation = ref<DonationInterface & { _id: string } | null>(null)
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const result = await fetchDonationById(route.params.id as string)
    if (result) donation.value = result
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6 max-w-xl mx-auto">
    <div v-if="loading">Loading donation...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="donation">
      <h1 class="text-2xl font-bold mb-2">{{ donation.name }}</h1>
      <p><strong>Email:</strong> {{ donation.email }}</p>
      <p><strong>Amount:</strong> ${{ donation.amount }}</p>
      <p class="text-sm text-gray-500">Created: {{ new Date(donation.createdAt!).toLocaleString() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDonations } from '~/composables/useDonation'
import { ref, onMounted } from 'vue'

const { fetchDonationById } = useDonations()
const route = useRoute()
const donation = ref()
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
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div v-if="loading">Loading donation...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <h1 class="text-2xl font-bold">{{ donation.name }}</h1>
      <p class="text-gray-600">Email: {{ donation.email }}</p>
      <p class="text-gray-600">Amount: ${{ donation.amount }}</p>
      <p class="text-sm text-gray-500">Created: {{ new Date(donation.createdAt).toLocaleString() }}</p>
    </div>
  </div>
</template>

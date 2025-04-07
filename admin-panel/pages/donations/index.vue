<script setup lang="ts">
import { useDonations } from '@/composables/useDonation'
import type { DonationInterface } from '@/interfaces/donation.interface'
import DonationCard from '@/components/donations/DonationCard.vue'

const { fetchDonations, deleteDonation } = useDonations()

const donations = ref<(DonationInterface & { _id: string })[]>([])
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    donations.value = await fetchDonations()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this donation?')) {
    await deleteDonation(id)
    donations.value = await fetchDonations()
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">All Donations</h1>
      <NuxtLink to="/donations/create" class="btn">+ Create Donation</NuxtLink>
    </div>

    <div v-if="loading" class="text-gray-500">Loading donations...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="donations.length" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <DonationCard
        v-for="donation in donations"
        :key="donation._id"
        :donation="donation"
        @delete="handleDelete"
      />
    </div>

    <div v-else-if="!loading" class="text-gray-600">No donations yet.</div>
  </div>
</template>

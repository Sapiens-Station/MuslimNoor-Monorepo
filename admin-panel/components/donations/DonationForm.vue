<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input v-model="form.name" type="text" required class="w-full border px-3 py-2 rounded" />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="form.email" type="email" required class="w-full border px-3 py-2 rounded" />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Amount</label>
        <input v-model.number="form.amount" type="number" required min="1" class="w-full border px-3 py-2 rounded" />
      </div>
  
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {{ submitLabel || 'Submit Donation' }}
      </button>
    </form>
  </template>
  
  <script setup lang="ts">
import type { DonationInterface } from '~/interfaces/donation.interface';

  const props = defineProps<{
    onSubmit: (form: DonationInterface) => Promise<void>
    submitLabel?: string
  }>()
  
  const form = ref({
    name: '',
    email: '',
    amount: 1
  })
  
  async function handleSubmit() {
    await props.onSubmit(form.value)
  }
  </script>
  
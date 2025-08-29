<template>
  <UForm :state="form" @submit.prevent="handleSubmit" class="space-y-4">
    <UInput v-model="form.name" label="Name" required />
    <UInput v-model="form.email" type="email" label="Email" required />
    <UInput v-model.number="form.amount" type="number" label="Amount" required />
    <UButton type="submit">{{ submitLabel || 'Submit' }}</UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { DonationInterface } from '@/interfaces/donation.interface'

const props = defineProps<{
  initialData?: DonationInterface
  onSubmit: (form: DonationInterface) => Promise<void>
  submitLabel?: string
}>()

const form = ref<DonationInterface>({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  amount: props.initialData?.amount || 0,
})

const handleSubmit = async () => {
  await props.onSubmit(form.value)
}
</script>

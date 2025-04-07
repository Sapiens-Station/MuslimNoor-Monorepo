<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label>Name</label>
      <input v-model="form.name" type="text" required class="input" />
    </div>

    <div>
      <label>Email</label>
      <input v-model="form.email" type="email" required class="input" />
    </div>

    <div>
      <label>Amount</label>
      <input v-model.number="form.amount" type="number" required class="input" />
    </div>

    <button class="btn" type="submit">{{ submitLabel || 'Submit' }}</button>
  </form>
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
  amount: props.initialData?.amount || 0
})

const handleSubmit = async () => {
  await props.onSubmit(form.value)
}
</script>

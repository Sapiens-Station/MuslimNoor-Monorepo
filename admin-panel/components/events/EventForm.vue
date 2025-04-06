<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700">Title</label>
      <input
        v-model="form.title"
        type="text"
        required
        class="w-full border px-3 py-2 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Mosque</label>
      <select
        v-model="form.mosqueId"
        required
        class="w-full border px-3 py-2 rounded"
      >
        <option disabled value="">-- Select a Mosque --</option>
        <option v-for="mosque in mosques" :key="mosque._id" :value="mosque._id">
          {{ mosque.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Date</label>
      <input
        v-model="form.date"
        type="date"
        required
        class="w-full border px-3 py-2 rounded"
      >
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="form.description"
        rows="4"
        class="w-full border px-3 py-2 rounded"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700"
        >Image URL (optional)</label
      >
      <input
        v-model="form.imageUrl"
        type="url"
        class="w-full border px-3 py-2 rounded"
      >
    </div>

    <div class="pt-4">
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUser } from '~/composables/useUser'
import type { EventInterface } from '~/interfaces/event.interface'
const { user, fetchUser } = useUser()
await fetchUser()

const selectedMosqueId = computed(() => user.value?.mosqueId || '')
const mosques = ref<{ _id: string; name: string }[]>([])

onMounted(async () => {
  try {
    const { data, error } = await useFetch<{ _id: string; name: string }[]>('/api/mosques')
    if (error.value) throw new Error(error.value.message)
    mosques.value = data.value || []
  } catch (err: unknown) {
    console.error('Error loading mosques:', err)
  }
})

const props = defineProps<{
  initialData?: {
    title: string
    description: string
    date: string
    mosqueId: string
    imageUrl?: string
  }
  onSubmit: (formData: EventInterface) => Promise<void>
  submitLabel?: string
}>()

const form = ref({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  date: props.initialData?.date || '',
  mosqueId: props.initialData?.mosqueId || '',
  imageUrl: props.initialData?.imageUrl || '',
})

const handleSubmit = async () => {
  const fullData: EventInterface = {
    ...form.value,
    mosqueId: selectedMosqueId.value,
  }

  await props.onSubmit(fullData)
}
</script>

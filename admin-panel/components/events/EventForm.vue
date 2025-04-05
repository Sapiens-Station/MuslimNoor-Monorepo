<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
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
      <label class="block text-sm font-medium text-gray-700">Date</label>
      <input
        v-model="form.date"
        type="date"
        required
        class="w-full border px-3 py-2 rounded"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="form.description"
        rows="4"
        class="w-full border px-3 py-2 rounded"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700"
        >Image URL (optional)</label
      >
      <input
        v-model="form.imageUrl"
        type="url"
        class="w-full border px-3 py-2 rounded"
      />
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
import { ref } from 'vue'

const props = defineProps<{
  initialData?: {
    title: string
    description: string
    date: string
    imageUrl?: string
  }
  onSubmit: (formData: any) => Promise<void>
  submitLabel?: string
}>()

const form = ref({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  date: props.initialData?.date || '',
  imageUrl: props.initialData?.imageUrl || '',
})

const handleSubmit = async () => {
  await props.onSubmit(form.value)
}
</script>

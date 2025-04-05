<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import { ref, onMounted } from 'vue'

const route = useRoute()
const { fetchEventById } = useEvents()

const event = ref()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    event.value = await fetchEventById(route.params.id as string)
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
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="event" class="space-y-4">
      <h1 class="text-3xl font-bold">{{ event.title }}</h1>
      <p class="text-sm text-gray-600">{{ event.date }}</p>
      <img
        v-if="event.imageUrl"
        :src="event.imageUrl"
        alt="Event Image"
        class="w-full rounded-lg"
      />
      <p class="text-gray-800">{{ event.description }}</p>
    </div>
  </div>
</template>

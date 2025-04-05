<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import { ref, onMounted } from 'vue'
import EventForm from '@/components/events/EventForm.vue'

const route = useRoute()
const router = useRouter()
const { fetchEventById, updateEvent } = useEvents()

const event = ref()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    event.value = await fetchEventById(route.params.id as string)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const handleUpdate = async (formData: any) => {
  try {
    await updateEvent(route.params.id as string, formData)
    router.push(`/events/${route.params.id}`)
  } catch (err) {
    alert('Update failed: ' + (err as Error).message)
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div v-if="loading">Loading event...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="event">
      <h1 class="text-2xl font-bold mb-4">Edit Event</h1>
      <EventForm
        :initial-data="event"
        :on-submit="handleUpdate"
        submit-label="Update Event"
      />
    </div>
  </div>
</template>

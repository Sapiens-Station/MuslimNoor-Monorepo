<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import EventForm from '@/components/events/EventForm.vue'
import type { EventFormInterface } from '~/interfaces/event.interface'

const { createEvent } = useEvents()
const router = useRouter()

const handleCreate = async (formData: EventFormInterface) => {
  try {
    await createEvent(formData)
    router.push('/events')
  } catch (err) {
    alert('Failed to create event: ' + (err as Error).message)
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Create New Event</h1>
    <EventForm :on-submit="handleCreate" submit-label="Create Event" />
  </div>
</template>

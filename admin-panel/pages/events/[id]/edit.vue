<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useEvents } from '@/composables/useEvents';
import { ref, onMounted } from 'vue';
import EventForm from '@/components/events/EventForm.vue';
import type { EventModel, EventUpdateDTO } from '~/interfaces/event.interface';

const route = useRoute();
const router = useRouter();
const { fetchEventById, updateEvent } = useEvents();

const event = ref<EventModel | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    event.value = await fetchEventById(route.params.id as string);
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
});

// Map backend model -> EventForm initialData (UI shape)
const initialData = computed(() => {
  if (!event.value) return undefined;
  return {
    title: event.value.title,
    subtitle: event.value.subtitle,
    description: event.value.description,

    // Build UI fields back from local keys
    date: event.value.startLocalDate,          // "YYYY-MM-DD"
    startTime: event.value.startLocalTime,     // "HH:mm"
    endTime: event.value.endLocalTime,         // "HH:mm" | undefined

    location: event.value.location,
    mapLink: event.value.mapLink,
    specialGuest: event.value.specialGuest,
    food: event.value.food,
    ageGroup: event.value.ageGroup,
    registration: !!event.value.registration,
    registrationLink: event.value.registrationLink,
    contactEmail: event.value.contactEmail,
    contactPhone: event.value.contactPhone,
    timeZone: event.value.timeZone,
  };
});

const handleUpdate = async (payload: EventUpdateDTO) => {
  try {
    await updateEvent(route.params.id as string, payload);
    router.push(`/events/${route.params.id}`);
  } catch (err) {
    alert('Update failed: ' + (err as Error).message);
  }
};
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div v-if="loading">Loading event...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="event">
      <h1 class="text-2xl font-bold mb-4">Edit Event</h1>
      <EventForm
        :initial-data="initialData"
        :on-submit="handleUpdate"
        submit-label="Update Event"
      />
    </div>
  </div>
</template>

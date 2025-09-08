<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useEvents } from '@/composables/useEvents';
import { ref, onMounted, computed } from 'vue';
import type { EventModel } from '~/interfaces/event.interface';

const route = useRoute();
const { fetchEventById } = useEvents();

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

// Display like: "Sat, 2025-09-27 at 12:00 (America/Chicago)"
const whenText = computed(() => {
  if (!event.value) return '';
  const end = event.value.endLocalTime ? `– ${event.value.endLocalTime}` : '';
  return `${event.value.startLocalDate} at ${event.value.startLocalTime}${end ? ' ' + end : ''} (${event.value.timeZone})`;
});
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="event" class="space-y-4">
      <h1 class="text-3xl font-bold">{{ event.title }}</h1>
      <p class="text-sm text-gray-600">
        {{ whenText }} • {{ event.location }}
      </p>

      <p v-if="event.subtitle" class="text-gray-700">{{ event.subtitle }}</p>
      <p class="text-gray-800 whitespace-pre-line">{{ event.description }}</p>

      <div class="text-sm text-gray-600 space-y-1">
        <div v-if="event.specialGuest"><strong>Special Guest:</strong> {{ event.specialGuest }}</div>
        <div v-if="event.food"><strong>Food:</strong> {{ event.food }}</div>
        <div v-if="event.ageGroup"><strong>Age Group:</strong> {{ event.ageGroup }}</div>
        <div v-if="event.registration">
          <strong>Registration:</strong>
          <NuxtLink v-if="event.registrationLink" :to="event.registrationLink" target="_blank" class="text-blue-600 underline">
            Register here
          </NuxtLink>
          <span v-else>Required</span>
        </div>
        <div v-if="event.mapLink">
          <NuxtLink :to="event.mapLink" target="_blank" class="text-blue-600 underline">Open Map</NuxtLink>
        </div>
        <div v-if="event.contactEmail"><strong>Contact:</strong> {{ event.contactEmail }}</div>
        <div v-if="event.contactPhone"><strong>Phone:</strong> {{ event.contactPhone }}</div>
      </div>
    </div>
  </div>
</template>

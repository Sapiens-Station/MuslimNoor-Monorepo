<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Title -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Title *</label>
      <input v-model="form.title" type="text" required class="w-full border px-3 py-2 rounded" />
    </div>

    <!-- Date & Times -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Date *</label>
        <input v-model="form.date" type="date" required class="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Start Time *</label>
        <input v-model="form.startTime" type="time" required class="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">End Time</label>
        <input v-model="form.endTime" type="time" class="w-full border px-3 py-2 rounded" />
      </div>
    </div>

    <!-- Location & Map -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Location</label>
        <input v-model="form.location" type="text" placeholder="Norman Mosque"
               class="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Map Link</label>
        <input v-model="form.mapLink" type="url" class="w-full border px-3 py-2 rounded" />
      </div>
    </div>

    <!-- Presentation -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Subtitle</label>
      <input v-model="form.subtitle" type="text" class="w-full border px-3 py-2 rounded" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea v-model="form.description" rows="4" class="w-full border px-3 py-2 rounded" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Special Guest</label>
        <input v-model="form.specialGuest" type="text" class="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Food</label>
        <input v-model="form.food" type="text" class="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Age Group</label>
        <input v-model="form.ageGroup" type="text" placeholder="Ages 14+"
               class="w-full border px-3 py-2 rounded" />
      </div>
    </div>

    <!-- Registration -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex items-center gap-3">
        <input id="registration" v-model="form.registration" type="checkbox" class="h-4 w-4" />
        <label for="registration" class="text-sm text-gray-700">Registration Required</label>
      </div>
      <div v-if="form.registration">
        <label class="block text-sm font-medium text-gray-700">Registration Link</label>
        <input v-model="form.registrationLink" type="url" class="w-full border px-3 py-2 rounded" />
      </div>
    </div>

    <!-- Contact -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Contact Email</label>
        <input v-model="form.contactEmail" type="email" class="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Contact Phone</label>
        <input v-model="form.contactPhone" type="tel" class="w-full border px-3 py-2 rounded" />
      </div>
    </div>

    <!-- Time Zone (hidden, but keep editable if you want) -->
    <div class="hidden">
      <label class="block text-sm font-medium text-gray-700">Time Zone</label>
      <input v-model="form.timeZone" type="text" class="w-full border px-3 py-2 rounded" />
    </div>

    <div class="pt-4">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { EventCreateDTO } from '~/interfaces/event.interface';

const props = defineProps<{
  initialData?: {
    // UI-level fields for the form
    title?: string;
    subtitle?: string;
    description?: string;

    // Date/time (UI)
    date?: string;        // "YYYY-MM-DD"
    startTime?: string;   // "HH:mm"
    endTime?: string;     // "HH:mm"

    // Etc.
    location?: string;
    mapLink?: string;
    specialGuest?: string;
    food?: string;
    ageGroup?: string;
    registration?: boolean;
    registrationLink?: string;
    contactEmail?: string;
    contactPhone?: string;
    timeZone?: string;
  };
  onSubmit: (payload: EventCreateDTO) => Promise<void>;
  submitLabel?: string;
}>();

const form = ref({
  title: props.initialData?.title ?? '',
  subtitle: props.initialData?.subtitle ?? '',
  description: props.initialData?.description ?? '',

  date: props.initialData?.date ?? '',            // "YYYY-MM-DD"
  startTime: props.initialData?.startTime ?? '',  // "HH:mm"
  endTime: props.initialData?.endTime ?? '',      // "HH:mm"

  location: props.initialData?.location ?? '',
  mapLink: props.initialData?.mapLink ?? '',
  specialGuest: props.initialData?.specialGuest ?? '',
  food: props.initialData?.food ?? '',
  ageGroup: props.initialData?.ageGroup ?? '',
  registration: props.initialData?.registration ?? false,
  registrationLink: props.initialData?.registrationLink ?? '',
  contactEmail: props.initialData?.contactEmail ?? '',
  contactPhone: props.initialData?.contactPhone ?? '',
  timeZone: props.initialData?.timeZone ?? 'America/Chicago',
});

const startLocal = computed(() => {
  if (!form.value.date || !form.value.startTime) return '';
  return `${form.value.date}T${form.value.startTime}`;
});

const endLocal = computed(() => {
  if (!form.value.date || !form.value.endTime) return undefined;
  return `${form.value.date}T${form.value.endTime}`;
});

const handleSubmit = async () => {
  if (!startLocal.value) {
    alert('Please select Date and Start Time.');
    return;
  }

  const payload: EventCreateDTO = {
    title: form.value.title,
    startLocal: startLocal.value,
    ...(endLocal.value ? { endLocal: endLocal.value } : {}),
    timeZone: form.value.timeZone,
    // optional fields — only include if present to keep payload clean
    ...(form.value.location ? { location: form.value.location } : {}),
    ...(form.value.mapLink ? { mapLink: form.value.mapLink } : {}),
    ...(form.value.subtitle ? { subtitle: form.value.subtitle } : {}),
    ...(form.value.description ? { description: form.value.description } : {}),
    ...(form.value.specialGuest ? { specialGuest: form.value.specialGuest } : {}),
    ...(form.value.food ? { food: form.value.food } : {}),
    ...(form.value.ageGroup ? { ageGroup: form.value.ageGroup } : {}),
    ...(form.value.registration ? { registration: true } : { registration: false }),
    ...(form.value.registration && form.value.registrationLink
      ? { registrationLink: form.value.registrationLink }
      : {}),
    ...(form.value.contactEmail ? { contactEmail: form.value.contactEmail } : {}),
    ...(form.value.contactPhone ? { contactPhone: form.value.contactPhone } : {}),
  };

  await props.onSubmit(payload);
};
</script>

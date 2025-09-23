<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useJamat, type JamatSchedule } from "~/composables/useJamat"
import { useToast } from "vue3-tailwind"

const route = useRoute()
const { getToday } = useJamat()
const { error } = useToast()

const loading = ref(true)
const schedule = ref<JamatSchedule | null>(null)

onMounted(async () => {
  try {
    const mosqueId = String(route.query.mosqueId ?? "")
    const date = new Date().toISOString().split("T")[0]
    schedule.value = await getToday(mosqueId, date)
  } catch (err: any) {
    error({ message: err.message, lifetime: 5000 })
  } finally {
    loading.value = false
  }
})

const prayerIcons: Record<string, string> = {
  Fajr: "🌅",
  Dhuhr: "☀️",
  Asr: "🌇",
  Maghrib: "🌆",
  Isha: "🌙",
  Jumuah: "🕌",
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Today’s Jamat Times</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="!schedule" class="text-red-600">No schedule found</div>
    <div v-else class="space-y-4">
      <div
        v-for="time in schedule.jamatTimes"
        :key="time.prayerName"
        class="flex justify-between items-center border rounded p-4 shadow-sm bg-white"
      >
        <span class="text-lg font-medium">
          {{ prayerIcons[time.prayerName] }} {{ time.prayerName }}
        </span>
        <span class="text-gray-700">{{ time.iqamaTime }}</span>
      </div>
    </div>
  </div>
</template>

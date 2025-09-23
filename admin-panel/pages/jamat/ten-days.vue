<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { useJamat, type JamatSchedule } from "~/composables/useJamat"
import { useToast } from "vue3-tailwind"

const route = useRoute()
const { getTenDays } = useJamat()
const { error } = useToast()

const loading = ref(true)
const schedules = ref<JamatSchedule[]>([])

onMounted(async () => {
  try {
    const mosqueId = String(route.query.mosqueId ?? "")
    schedules.value = await getTenDays(mosqueId)
  } catch (err: any) {
    error({ message: err.message, lifetime: 5000 })
  } finally {
    loading.value = false
  }
})

const rows = computed(() => {
  return schedules.value.map((s) => {
    const row: Record<string, string> = { date: s.dayKey }
    for (const jt of s.jamatTimes) {
      row[jt.prayerName] = jt.iqamaTime
    }
    return row
  })
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">10-Day Jamat Schedule</h1>

    <div v-if="loading">Loading...</div>
    <div v-else>
      <table class="w-full border border-gray-200 rounded shadow-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Fajr</th>
            <th class="px-4 py-2 text-left">Dhuhr</th>
            <th class="px-4 py-2 text-left">Asr</th>
            <th class="px-4 py-2 text-left">Maghrib</th>
            <th class="px-4 py-2 text-left">Isha</th>
            <th class="px-4 py-2 text-left">Jumuah</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.date"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2 font-medium">{{ row.date }}</td>
            <td class="px-4 py-2">{{ row.Fajr || "-" }}</td>
            <td class="px-4 py-2">{{ row.Dhuhr || "-" }}</td>
            <td class="px-4 py-2">{{ row.Asr || "-" }}</td>
            <td class="px-4 py-2">{{ row.Maghrib || "-" }}</td>
            <td class="px-4 py-2">{{ row.Isha || "-" }}</td>
            <td class="px-4 py-2">{{ row.Jumuah || "-" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

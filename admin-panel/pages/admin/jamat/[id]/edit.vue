<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useJamat, type JamatSchedule } from "~/composables/useJamat"
import { useToast, TwButton } from "vue3-tailwind"

const route = useRoute()
const { getToday, updatePrayerTime } = useJamat()
const { success, error } = useToast()

const schedule = ref<JamatSchedule | null>(null)

onMounted(async () => {
  try {
    const mosqueId = "replace-with-loggedin-mosqueId"
    const date = new Date().toISOString().split("T")[0]
    schedule.value = await getToday(mosqueId, date)
  } catch (err: any) {
    error({ message: err.message, lifetime: 5000 })
  }
})

async function savePrayer(id: string, prayerName: string, iqamaTime: string) {
  try {
    if (!schedule.value) return
    schedule.value = await updatePrayerTime(id, { prayerName, iqamaTime })
    success({ message: `${prayerName} updated`, lifetime: 3000 })
  } catch (err: any) {
    error({ message: err.message, lifetime: 5000 })
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Edit Jamat Times</h1>
    <div v-if="!schedule">Loading...</div>
    <div v-else class="space-y-4">
      <div
        v-for="time in schedule.jamatTimes"
        :key="time.prayerName"
        class="flex justify-between items-center border rounded p-4 shadow-sm bg-white"
      >
        <span class="font-medium">{{ time.prayerName }}</span>
        <div class="flex gap-2 items-center">
          <input
            type="time"
            v-model="time.iqamaTime"
            class="border rounded px-2 py-1"
          />
          <TwButton
            size="sm"
            variant="primary"
            @click="savePrayer(schedule._id, time.prayerName, time.iqamaTime)"
          >
            Save
          </TwButton>
        </div>
      </div>
    </div>
  </div>
</template>

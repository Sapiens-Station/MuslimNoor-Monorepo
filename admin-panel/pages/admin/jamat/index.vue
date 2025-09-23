<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useJamat, type JamatSchedule } from "~/composables/useJamat"
import { useToast, TwButton } from "vue3-tailwind"

const { getTenDays, deleteSchedule, autoFill } = useJamat()
const { success, error } = useToast()

const schedules = ref<JamatSchedule[]>([])
const loading = ref(true)

const mosqueId = "replace-with-loggedin-mosqueId" // TODO: from auth

onMounted(async () => {
  try {
    schedules.value = await getTenDays(mosqueId)
  } catch (err: any) {
    error({ message: err.message, lifetime: 5000 })
  } finally {
    loading.value = false
  }
})

async function handleDelete(id: string) {
  if (!confirm("Delete this schedule?")) return
  try {
    await deleteSchedule(id)
    schedules.value = schedules.value.filter((s) => s._id !== id)
    success({ message: "Schedule deleted", lifetime: 3000 })
  } catch (err: any) {
    error({ message: err.message, lifetime: 5000 })
  }
}

async function handleAutoFill() {
  try {
    await autoFill({
      mosqueId,
      lat: 35.2,
      lon: -97.4,
      date: new Date().toISOString().split("T")[0],
    })
    schedules.value = await getTenDays(mosqueId)
    success({ message: "Auto-fill complete", lifetime: 3000 })
  } catch (err: any) {
    error({ message: err.message, lifetime: 5000 })
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Jamat Schedules</h1>
      <TwButton variant="primary" @click="handleAutoFill">Auto-Fill Today</TwButton>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else>
      <table class="w-full border border-gray-200 rounded shadow-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="sch in schedules"
            :key="sch._id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2 font-medium">{{ sch.dayKey }}</td>
            <td class="px-4 py-2 space-x-3">
              <NuxtLink
                :to="`/admin/jamat/${sch._id}/edit`"
                class="text-blue-600 hover:underline"
              >
                Edit
              </NuxtLink>
              <TwButton
                variant="danger"
                size="sm"
                @click="handleDelete(sch._id)"
              >
                Delete
              </TwButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

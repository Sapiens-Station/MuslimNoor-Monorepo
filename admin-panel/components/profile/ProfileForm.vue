<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { UserUpdateDTO } from '~/interfaces/user.interface'

const props = defineProps<{
  initial: { name: string; email: string; contactNumber?: string }
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: UserUpdateDTO): void
  (e: 'cancel'): void
}>()

const form = reactive<UserUpdateDTO>({
  name: props.initial.name || '',
  email: props.initial.email || '',
  contactNumber: props.initial.contactNumber || '',
  password: '',
})

const emailError = computed(() =>
  /^\S+@\S+\.\S+$/.test(form.email || '') ? '' : 'Please enter a valid email'
)

const onSubmit = () => {
  if (emailError.value) return
  if (form.password && form.password.length < 6) return
  emit('submit', { ...form })
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <input v-model="form.name" type="text" class="mt-1 w-full rounded border border-gray-300 px-3 py-2" required />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input v-model="form.email" type="email" class="mt-1 w-full rounded border border-gray-300 px-3 py-2" required />
      <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Contact Number</label>
      <input v-model="form.contactNumber" type="text" class="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">New Password</label>
      <input v-model="form.password" type="password" class="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
      <p class="mt-1 text-sm text-gray-500">Leave blank to keep current. Min 6 chars if changing.</p>
    </div>

    <div class="flex gap-3">
      <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" :disabled="busy || !!emailError">
        {{ busy ? 'Saving…' : 'Save Changes' }}
      </button>
      <button type="button" class="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>

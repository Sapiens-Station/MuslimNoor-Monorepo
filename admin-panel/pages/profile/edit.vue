<!-- Route: /profile/edit -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUser } from '~/composables/useUser'
import ProfileForm from '~/components/profile/ProfileForm.vue'
import type { UserUpdateDTO } from '~/interfaces/user.interface'
import { navigateTo } from 'nuxt/app'

const { profile, loading, error, fetchUser, updateUser } = useUser()
const saving = ref(false)
const success = ref('')

onMounted(fetchUser)

const handleSubmit = async (payload: UserUpdateDTO) => {
  success.value = ''
  try {
    saving.value = true
    await updateUser(payload)
    success.value = 'Profile updated successfully.'
    setTimeout(() => navigateTo('/profile'), 600)
  } catch (e) {
    // handled in composable
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6">Edit Profile</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else>
      <div v-if="success" class="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
        {{ success }}
      </div>

      <ProfileForm
        v-if="profile"
        :initial="{
          name: profile.name,
          email: profile.email,
          contactNumber: profile.contactNumber || ''
        }"
        :busy="saving"
        @submit="handleSubmit"
        @cancel="() => navigateTo('/profile')"
      />
    </div>
  </div>
</template>

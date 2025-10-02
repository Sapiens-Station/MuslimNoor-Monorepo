<!-- Route: /profile -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '~/composables/useUser'
import ProfileCard from '~/components/profile/ProfileCard.vue'

const { profile, loading, error, fetchUser } = useUser()
onMounted(fetchUser)
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold mb-6">My Profile</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <ProfileCard v-else-if="profile" :profile="profile" />

    <div class="mt-6">
      <NuxtLink to="/profile/edit" class="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Edit Profile
      </NuxtLink>
    </div>
  </div>
</template>

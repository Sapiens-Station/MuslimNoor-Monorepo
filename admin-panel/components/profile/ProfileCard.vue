<script setup lang="ts">
import type { UserModel } from '~/interfaces/user.interface'

defineProps<{ profile: UserModel }>()
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <p class="text-sm text-gray-500">Name</p>
        <p class="font-medium text-gray-900">{{ profile.name }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Email</p>
        <p class="font-medium text-gray-900 break-all">{{ profile.email }}</p>
      </div>
      <div v-if="profile.contactNumber">
        <p class="text-sm text-gray-500">Contact Number</p>
        <p class="font-medium text-gray-900">{{ profile.contactNumber }}</p>
      </div>
      <div v-if="profile.role">
        <p class="text-sm text-gray-500">Role</p>
        <span class="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize">
          {{ profile.role }}
        </span>
      </div>
    </div>
  </div>
</template>

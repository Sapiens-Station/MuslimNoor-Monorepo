<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white p-8 shadow-md rounded-xl">
      <h2 class="text-2xl font-semibold text-center mb-6">Admin Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const { login } = useAuth()

async function handleLogin() {
  error.value = ''
  try {
    await login(email.value, password.value)
    router.push('/dashboard/salat') // redirect after login
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err?.message || 'Login failed. Please try again.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
  }
}
</script>

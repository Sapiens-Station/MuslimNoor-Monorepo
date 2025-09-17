<template>
  <AuthLayout
    invite-title="Welcome Back!"
    invite-message="To keep connected with us please login with your personal info."
    invite-link="/auth/login"
    invite-label="Sign In"
  >
    <!-- Signup Form Container -->
    <div class="flex flex-1 items-center justify-center py-12">
      <div class="w-full max-w-md px-10 flex flex-col items-center">
        <!-- Heading -->
        <h2 class="text-2xl font-bold text-center text-[#11B175]">
          Create an Account
        </h2>
        <div class="w-16 h-[2px] bg-[#11B175] mx-auto mt-2 mb-8"></div>

        <!-- AuthInput fields -->
        <div class="space-y-5 mb-6 w-full">
          <AuthInput
            v-model="form.name"
            type="text"
            placeholder="Full Name"
            icon="user"
          />
          <AuthInput
            v-model="form.email"
            type="email"
            placeholder="Email"
            icon="mail"
          />
          <AuthInput
            v-model="form.password"
            type="password"
            placeholder="Password"
            icon="lock"
            show-toggle
          />
          <AuthInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            icon="lock"
            show-toggle
          />


          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mosque</label>
            <select
              v-model="form.mosqueId"
              class="w-full border border-gray-300 rounded px-3 h-10 focus:ring-[#11B175]"
            >
              <option
                v-for="mosque in mosques"
                :key="mosque._id"
                :value="mosque._id"
              >
                {{ mosque.name }}
              </option>
            </select>
          </div>

        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-500 text-sm mb-4">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <AuthButton :disabled="loading" @click="handleSignup">
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign Up</span>
        </AuthButton>
      </div>
    </div>
  </AuthLayout>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useMosques } from '~/composables/useMosques'
import type { MosqueModel } from '~/interfaces/mosque.interface'

import AuthLayout from '~/layouts/auth.vue'
import AuthInput from '~/components/auth/AuthInput.vue'
import AuthButton from '~/components/auth/AuthButton.vue'

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  mosqueId: '68c9beaf13c2803c84075495', // default ✅
  role: 'user', // default ✅
  fcmToken: null, // default ✅
})

const mosques = ref<MosqueModel[]>([])
const error = ref('')
const loading = ref(false)

const router = useRouter()
const { signup } = useAuth()
const { fetchMosques } = useMosques()  // ✅ proper composable

onMounted(async () => {
  console.log('Fetching mosques...')
  try {
    mosques.value = await fetchMosques()   // ✅ CALL it
    console.log('Mosques loaded:', mosques.value)
  } catch (e) {
    console.error('❌ Failed to load mosques', e)
  }
})

async function handleSignup() {
  error.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  try {
    await signup(form.value) // ✅ sends full payload
    router.push('/auth/login')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err?.message || 'Signup failed. Please try again.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}
</script>


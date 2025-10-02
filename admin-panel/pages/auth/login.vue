<template>
  <AuthLayout
    invite-title="Hello, Friend!"
    invite-message="Fill up personal information and start journey with us."
    invite-link="/auth/register"
    invite-label="Sign Up"
  >
    <!-- Login Form Container (centered with spacing) -->
    <div class="flex flex-1 items-center justify-center py-12">
      <div class="w-full max-w-md px-10 flex flex-col items-center">
        <!-- Heading -->
        <h2 class="text-2xl font-bold text-center text-[#11B175]">
          Sign in to Account
        </h2>
        <div class="w-16 h-[2px] bg-[#11B175] mx-auto mt-2 mb-8"></div>

        <!-- Social Login -->
        <div class="flex justify-center space-x-6 mb-8">
          <button
            class="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:bg-gray-100"
          >
            f
          </button>
          <button
            class="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:bg-gray-100"
          >
            in
          </button>
          <button
            class="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full hover:bg-gray-100"
          >
            G
          </button>
        </div>

        <p class="text-center text-sm text-gray-500 mb-8">
          or use your email account
        </p>

        <!-- AuthInput fields -->
        <div class="space-y-5 mb-6 w-full">
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
        </div>

        <!-- Options -->
        <div
          class="flex items-center justify-between mb-6 w-full text-sm text-gray-600"
        >
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="rememberMe" class="rounded" />
            <span>Remember me</span>
          </label>
          <NuxtLink to="/auth/forgot-password" class="hover:underline">
            Forgot Password?
          </NuxtLink>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-500 text-sm mb-4">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <AuthButton :disabled="loading" @click="handleSubmit">
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </AuthButton>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import AuthLayout from '~/layouts/auth.vue'
import AuthInput from '~/components/auth/AuthInput.vue'
import AuthButton from '~/components/auth/AuthButton.vue'

const form = ref({
  email: '',
  password: '',
})
const rememberMe = ref(false)
const error = ref('')
const loading = ref(false)

const router = useRouter()
const { login } = useAuth()

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login({
      email: form.value.email,
      password: form.value.password,
    })
    router.push('/') // redirect after login
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err?.message || 'Login failed. Please try again.'
    } else {
      error.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <UForm :state="form" @submit.prevent="handleSubmit" class="space-y-4">
      <UInput v-model="form.email" type="email" label="Email" required />
      <UInput v-model="form.password" type="password" label="Password" required />
      <UButton type="submit">Login</UButton>
    </UForm>
  </template>
  
  <script setup lang="ts">
  const form = ref({ email: '', password: '' })
  
  const handleSubmit = async () => {
    try {
      const { $auth } = useNuxtApp()
      await $auth.login(form.value.email, form.value.password)
      navigateTo('/dashboard')
    } catch (err) {
      console.error(err)
    }
  }
  </script>
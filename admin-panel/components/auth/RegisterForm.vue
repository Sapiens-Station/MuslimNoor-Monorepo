<template>
    <UForm :state="form" @submit.prevent="handleSubmit" class="space-y-4">
      <UInput v-model="form.name" label="Name" required />
      <UInput v-model="form.email" type="email" label="Email" required />
      <UInput v-model="form.password" type="password" label="Password" required />
      <UButton type="submit">Register</UButton>
    </UForm>
  </template>
  
  <script setup lang="ts">
  const form = ref({ name: '', email: '', password: '' })
  
  const handleSubmit = async () => {
    try {
      await useFetch('/auth/register', {
        method: 'POST',
        body: form.value,
      })
      navigateTo('/login')
    } catch (err) {
      console.error(err)
    }
  }
  </script>
  
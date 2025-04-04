<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Events Management</h1>
    <p class="text-gray-600">
      Here you'll add, update, or remove upcoming events.
    </p>
  </div>
</template>
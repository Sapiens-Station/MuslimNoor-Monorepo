<template>
  <button
    :type="type"
    @click="$emit('click')"
    class="w-full border-2 border-[#11B175] text-[#11B175] h-10 rounded-full hover:bg-[#11B175] hover:text-white transition text-sm font-medium"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: "button" | "submit" | "reset"
}>()
</script>


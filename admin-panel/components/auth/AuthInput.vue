<template>
    <div class="relative w-full">
      <!-- Left Icon -->
      <span
        v-if="icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        <i :data-feather="icon" class="w-4 h-4"></i>
      </span>
  
      <!-- Input -->
      <input
        :type="computedType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full border border-gray-300 rounded h-10 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#11B175] bg-white"
      />
  
      <!-- Eye Toggle (for password) -->
      <span
        v-if="showToggle && type === 'password'"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        @click="togglePassword"
      >
        <i :data-feather="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4"></i>
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import feather from 'feather-icons'
  
  /** Props */
  const props = defineProps<{
    modelValue: string
    type: string
    placeholder: string
    icon?: string
    showToggle?: boolean
  }>()
  
  /** Emits */
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  
  /** State */
  const showPassword = ref(false)
  
  /** Computed input type */
  const computedType = computed(() =>
    props.type === 'password' && props.showToggle
      ? showPassword.value
        ? 'text'
        : 'password'
      : props.type
  )
  
  /** Methods */
  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }
  
  /** Refresh feather icons on mount and updates */
  onMounted(() => {
    feather.replace()
  })
  watch([() => props.icon, showPassword], () => {
    feather.replace()
  })
  </script>
  
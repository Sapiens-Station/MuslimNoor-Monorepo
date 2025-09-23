<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useToast, TwButton, TwDialog, TwFeather, TwToast } from "vue3-tailwind"

const { $pwa } = useNuxtApp()
const toast = useToast()

// Check PWA ready state on mount and whenever it changes
onMounted(() => {
  if ($pwa?.offlineReady) {
    toast.success({ message: "App ready to work offline", lifetime: 4000 })
  }
})

watch(
  () => $pwa?.offlineReady,
  (ready) => {
    if (ready) {
      toast.success({ message: "App ready to work offline", lifetime: 4000 })
    }
  }
)
</script>

<template>
  <NuxtPwaManifest />

  <NuxtLayout>
    <!-- Global confirmation dialog -->
    <TwDialog>
      <template #default="{ isShown, dialog, confirm, reject }">
        <!-- Backdrop -->
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isShown.value"
            class="fixed inset-0 z-40 bg-gray-400 dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70"
          />
        </transition>

        <!-- Dialog box -->
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:scale-95"
        >
          <div
            v-if="isShown.value"
            class="fixed inset-0 z-50 flex items-center justify-center"
            @click.self="reject"
          >
            <div
              class="bg-white dark:bg-gray-900 rounded shadow-lg w-96 overflow-hidden"
            >
              <div
                class="border-b dark:border-gray-700 p-2 border-t-4 border-t-gray-800 dark:border-t-gray-200 flex gap-4"
              >
                <div class="flex items-center">
                  <TwFeather
                    class="text-gray-600 dark:text-gray-400"
                    size="50"
                    :type="dialog.icon"
                  />
                </div>
                <div class="py-2">
                  <div
                    class="title text-gray-800 dark:text-gray-200 font-bold"
                  >
                    {{ dialog.title }}
                  </div>
                  <div
                    v-if="dialog.description"
                    class="description text-gray-500 dark:text-gray-400 italic"
                    v-html="dialog.description"
                  />
                </div>
              </div>
              <div class="footer flex justify-center gap-2 p-2">
                <TwButton
                  ripple
                  class="w-20"
                  variant="secondary"
                  @click="reject"
                >
                  {{ dialog.rejectText }}
                </TwButton>
                <TwButton ripple class="w-20" @click="confirm">
                  {{ dialog.acceptText }}
                </TwButton>
              </div>
            </div>
          </div>
        </transition>
      </template>
    </TwDialog>

    <!-- Page content -->
    <NuxtPage />

    <!-- Global toast container -->
    <TwToast />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

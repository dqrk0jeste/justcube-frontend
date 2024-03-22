<script setup lang="ts">
import { currentMessage } from '@/composables/useToast'

</script>

<template>
  <Transition name="swipe">
    <div
      v-if="currentMessage"
      class="lg:hidden fixed top-3 left-1/2 -translate-x-1/2 mx-auto w-[96vw] max-w-[400px] min-h-[100px] p-5 flex items-center bg-gray-200 rounded-lg z-50"
    >
      <div>
        <p class="font-bold text-xl text-black">{{ currentMessage?.heading }}</p>
        <p class="text-black">{{ currentMessage?.paragraph }}</p>
      </div>
    </div>
  </Transition>
  <Transition name="swipe">
    <div
      v-if="currentMessage"
      class="hidden lg:flex fixed bottom-3 right-3 w-full max-w-[400px] min-h-[100px] p-5 items-center bg-gray-200 rounded-lg z-50"
    >
      <div>
        <p class="font-bold text-xl text-black">{{ currentMessage?.heading }}</p>
        <p class="text-black">{{ currentMessage?.paragraph }}</p>
      </div>
    </div>
  </Transition>
</template>

<style>
.swipe-enter-active,
.swipe-leave-active {
  transition: all 0.3s ease;
}

.swipe-enter-from {
  opacity: 0;
  transform: translateY(120%);
}

.swipe-enter-to {
  opacity: 1;
}

.swipe-leave-from {
  opacity: 1;
}

.swipe-leave-to {
  opacity: 1;
  transform: translateX(120%);
}
</style>
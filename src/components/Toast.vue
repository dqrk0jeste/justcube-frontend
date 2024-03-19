<script setup lang="ts">
import type { Messages } from '@/utils/toast'
import { watch } from 'vue';
const props = defineProps<{
  typeOfMessage: Messages | null,
}>()
</script>

<template>
  <div
    class="lg:hidden fixed top-3 left-1/2 -translate-x-1/2 mx-auto w-[96vw] max-w-[400px] min-h-[100px] p-5 flex items-center bg-gray-200 rounded-lg z-50"
  >
    <div>
      <p class="font-bold text-xl text-black">there has been an error!</p>
      <p class="text-black">plase try again</p>
    </div>
  </div>
  <div
    class="hidden lg:flex fixed bottom-3 right-3 w-full max-w-[400px] min-h-[100px] p-5 items-center bg-gray-200 rounded-lg z-50"
  >
    <div>
      <p class="font-bold text-xl text-black">there has been an error!</p>
      <p class="text-black">please try again.</p>
    </div>
  </div>
</template>
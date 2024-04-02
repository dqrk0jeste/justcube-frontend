<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea, input: textContent } = useTextareaAutosize({ styleProp: 'minHeight' })
</script>

<template>
  <form class="p-3 bg-neutral-900 rounded-2xl">
    <div class="border-white border rounded-xl">
      <textarea
        ref="textarea"
        v-model="textContent"
        name="new-post"
        id="new-post"
        rows="5"
        placeholder="have something to share?"
        class="block w-full resize-none bg-transparent p-3 outline-none overflow-hidden text-xl"
      ></textarea>
      <div class="p-2 flex justify-between gap-9">
        <div class="flex gap-3 items-center">
          <button type="button" class="py-2 px-6 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <box-icon name='image-add' size="sm" color="white"></box-icon>
          </button>
          <button type="button" class="py-2 px-6 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <box-icon name='link' size="sm" color="white"></box-icon>
          </button>
          <button type="button" class="py-2 px-6 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
            <box-icon name='cube' size="sm" color="white"></box-icon>
          </button>
        </div>
        <button type="submit" class="flex-1 max-w-[300px] rounded-full bg-blue-200 text-xl text-black">
          upload
        </button>
      </div>
    </div>
  </form>
</template>
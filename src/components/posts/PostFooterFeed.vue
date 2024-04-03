<script setup lang="ts">

const { id } = defineProps<{ id: string }>()
  
// TODO: when chats are added this thing should improve 
function sharePost() {
  navigator.clipboard.writeText(location.origin + '/posts/' + id)
  console.log(location.origin + '/posts/' + id)
}
</script>

<template>
  <div class="pt-3 flex justify-end gap-3">
    <button 
      @click="sharePost()"
      class="flex items-center w-[50px] justify-center aspect-square bg-white/5 rounded-full hover:bg-white/10 transition-colors"
    >
      <box-icon name="share" color="white"></box-icon>
    </button>
    <RouterLink
      :to="`/posts/${ id }`"
      class="flex items-center w-[50px] justify-center aspect-square bg-white/5 rounded-full hover:bg-white/10 transition-colors"
    >
      <box-icon name="message-square-dots" color="white"></box-icon>
    </RouterLink>
  </div>
</template>
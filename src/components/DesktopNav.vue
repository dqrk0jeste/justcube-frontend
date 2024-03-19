<script setup lang="ts">
  import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="flex flex-col justify-start gap-4 py-4">
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">feed</RouterLink>
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">timer</RouterLink>
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">rooms</RouterLink>
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">profile</RouterLink>
  </nav>
</template>
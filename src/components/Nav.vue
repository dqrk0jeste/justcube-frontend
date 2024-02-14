<script setup lang="ts">
  import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="hidden lg:flex w-[var(--nav-width-desktop)] mt-5 flex-col justify-start gap-4">
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">feed</RouterLink>
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">timer</RouterLink>
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">rooms</RouterLink>
    <RouterLink to="/" class="text-center bg-neutral-900 p-4 text-xl rounded-full transition-color hover:bg-white/10">profile</RouterLink>
  </nav>

  <!-- mobile nav -->
  <nav class="flex lg:hidden w-[var(--nav-width-mobile)] flex-col gap-4 justify-start">
    <RouterLink to="/" class="w-full aspect-square rounded-full bg-neutral-900 flex items-center justify-center">
      <box-icon name="news" color="white"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="w-full aspect-square rounded-full bg-neutral-900 flex items-center justify-center">
      <box-icon name="stopwatch" color="white"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="w-full aspect-square rounded-full bg-neutral-900 flex items-center justify-center">
      <box-icon name="cube-alt" color="white"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="w-full aspect-square rounded-full bg-neutral-900 flex items-center justify-center">
      <box-icon name="user" color="white"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="w-full aspect-square rounded-full bg-neutral-900 flex items-center justify-center">
      <box-icon name="search" color="white"></box-icon>
    </RouterLink>
  </nav>
</template>
<script setup lang="ts">
  import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="flex lg:hidden w-full h-[--nav-height-mobile] py-1 px-2 fixed bottom-0 flex-row justify-between gap-2 bg-black z-50">
    <RouterLink to="/" class="rounded-full flex-1 bg-neutral-900 flex items-center justify-center">
      <box-icon name="news" color="white" size="md"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="rounded-full flex-1 bg-neutral-900 flex items-center justify-center">
      <box-icon name="stopwatch" color="white" size="md"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="rounded-full flex-1 bg-neutral-900 flex items-center justify-center">
      <box-icon name="cube" color="white" size="md"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="rounded-full flex-1 bg-neutral-900 flex items-center justify-center">
      <box-icon name="user" color="white" size="md"></box-icon>
    </RouterLink>
    <RouterLink to="/" class="rounded-full flex-1 bg-neutral-900 flex items-center justify-center">
      <box-icon name="search" color="white" size="md"></box-icon>
    </RouterLink>
  </nav>
</template>
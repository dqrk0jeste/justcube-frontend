<script setup lang="ts">
  import Header from '@/components/Header.vue'
  import SideTab from '@/components/SideTab.vue'
  import Nav from '@/components/Nav.vue'
</script>

<template>
  <div class="w-screen h-[100dvh] bg-black">
    <Header />
    <div class="h-[calc(100dvh-var(--header-height)-3px)] md:h-[calc(100dvh-var(--header-height)-12px)] flex mx-1 md:mx-3 gap-2 md:gap-3">
      <Nav />
      <main class="flex-1 overflow-hidden">
        <slot />
      </main>
      <SideTab />
    </div>
  </div>
</template>
<script setup lang="ts">
  import Header from '@/components/Header.vue'
  import SideTab from '@/components/SideTab.vue'
  import Nav from '@/components/Nav.vue'
</script>

<template>
  <div class="max-w-[--max-width] m-auto">
    <Header />
    <div class="mt-[--header-height] w-full grid grid-cols-12 gap-3 px-3">
      <div class="col-span-2 h-fit sticky top-[--header-height]">
        <Nav />
      </div>
      <main class="col-span-8">
        <slot />
      </main>
      <div class="col-span-2 h-fit sticky top-[--header-height]">
        <SideTab />
      </div>
    </div>
  </div>
</template>
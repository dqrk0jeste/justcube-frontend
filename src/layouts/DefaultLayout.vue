<script setup lang="ts">
import Header from '@/components/Header.vue'
import SideTab from '@/components/SideTab.vue'
import DesktopNav from '@/components/DesktopNav.vue'
import MobileNav from '@/components/MobileNav.vue'
import Toast from '@/components/Toast.vue'
</script>

<template>
  <div class="max-w-[--max-width] m-auto">
    <Toast />
    <Header />
    <div class="mt-[--header-height] mb-[--nav-height-mobile] lg:mb-0 w-full lg:grid lg:grid-cols-12 lg:gap-3 px-3">
      <div class="hidden lg:block col-span-2 h-fit sticky top-[--header-height]">
        <DesktopNav />
      </div>
      <main class="col-span-8">
        <slot />
      </main>
      <div class="hidden lg:block col-span-2 h-fit sticky top-[--header-height]">
        <SideTab />
      </div>
    </div>
    <MobileNav />
  </div>
</template>
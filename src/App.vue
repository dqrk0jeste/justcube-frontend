<script setup lang="ts">
  import DefaultLayout from './layouts/DefaultLayout.vue'
</script>

<template>
  <div class="max-w-[var(--max-width)] m-auto">
    <DefaultLayout>
    <Suspense>
      <RouterView />
    </Suspense>
  </DefaultLayout>
  </div>
  
</template>

<style scoped>
</style>

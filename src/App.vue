<script setup lang="ts">
  import 'boxicons'

  import DefaultLayout from './layouts/DefaultLayout.vue'
</script>

<template>
  <div class="max-w-[var(--max-width)] m-auto">
    <DefaultLayout>
    <Suspense>
      <RouterView />
      <template #fallback>
        <div class="text-4xl grid place-items-center">
          Loading...
        </div>
      </template>
    </Suspense>
  </DefaultLayout>
  </div>
  
</template>

<style scoped>
</style>

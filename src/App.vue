<script setup lang="ts">
  import DefaultLayout from './layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <Suspense>
      <RouterView />
    </Suspense>
  </DefaultLayout>
</template>

<style scoped>
</style>

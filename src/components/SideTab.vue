<script setup lang="ts">
  import Input from '@/components/Input.vue'
</script>

<template>
  <aside>
    <h3 class="text-xl py-4">search for people</h3>
    <Input placeholder="type here...">
      <box-icon name="search" color="black" size="md" class="transition-all hover:scale-105"></box-icon>
    </Input>
  </aside>
</template>
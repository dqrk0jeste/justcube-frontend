<script setup lang="ts">
const { color } = withDefaults(defineProps<{
  color: string
}>(), {
  color: 'white',
})
</script>

<template>
  <box-icon name="loader-circle" animation="spin" :color="color"></box-icon>
</template>
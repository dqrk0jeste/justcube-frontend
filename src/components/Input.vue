<script setup lang="ts">
const text = defineModel<string>()

const props = defineProps<{
  placeholder?: string,
  for?: string,
  name?: string,
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="relative rounded-xl overflow-hidden">
    <input
      v-model="text"
      type="text"
      :placeholder="props.placeholder"
      :for="props.for"
      :name="props.name"
      class="p-2 pr-[50px] text-lg text-black outline-none w-full min-w-0"
    >
    <button
      @click="$emit('click')"
      class="absolute top-1/2 translate-y-[-50%] right-0 flex p-1 items-center bg-blue-200"
      :disabled="text === '' ? true : false"
    >
      <slot />
    </button>
  </div>
</template>
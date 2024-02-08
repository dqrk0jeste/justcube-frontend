<script setup lang="ts">
  import type { User } from '@/utils/types';

  const { user } = defineProps<{
    user: User,
  }>()

</script>

<template>
  <div class="flex items-center gap-2 w-fit">
    <RouterLink :to="`/users/${ user.id }`">
      <img src="https://placehold.co/40" alt="profile-image" class="aspect-square w-[40px] rounded-full transition-all hover:scale-105">
    </RouterLink>
    <RouterLink :to="`/users/${ user.id }`">
      <span class="text-lg transition-all hover:underline underline-offset-2">
        {{ user.username }}
      </span>
    </RouterLink>
  </div>
</template>
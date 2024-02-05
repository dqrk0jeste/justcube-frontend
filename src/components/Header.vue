<script setup lang="ts">
  import { computed } from 'vue';

  // const currentUser = useCurrentUser()

  const username = 'darko'
  // TODO: this should get it from the s3 bucket
  const profileImage = 'https://placehold.co/50'
  const profileLink = '/'

</script>

TODO: add custom image and link based on current user
<template>
  <header class="h-[var(--header-height)] px-1 md:px-3 relative flex items-center gap-3">
    <RouterLink :to="profileLink">
      <img :src="profileImage" alt="profile-image" class="aspect-square w-[50px] rounded-full transition-all hover:scale-105">
    </RouterLink>
    <RouterLink :to="profileLink">
      <span class="text-lg hidden md:block transition-all hover:underline underline-offset-4">
        {{ username }}
      </span>
    </RouterLink>
    <div class="absolute left-1/2 -translate-x-1/2 flex items-center">
      <h2 class="text-4xl whitespace-nowrap">let's cube</h2>
    </div>
  </header>
</template>
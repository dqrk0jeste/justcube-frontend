<script setup lang="ts">
import { computed } from 'vue'

import { useCurrentUser } from '@/composables/useCurrentUser';

const currentUser = useCurrentUser()

const username = computed(() => currentUser.value.isGuest ? 'login' : currentUser.value.userInfo?.username)
const profileImage = computed(() => currentUser.value.isGuest ? 'https://placehold.co/40' : `https://placehold.co/40`)
const profileLink = computed(() => currentUser.value.isGuest ? '/login' : `/users/${currentUser.value.userInfo?.id}`)

</script>

<template>
  <header class="h-[var(--header-height)] fixed top-0 left-0 w-full z-40 bg-black">
    <div class="max-w-[var(--max-width)] mx-auto px-1 md:px-3 h-full flex items-center gap-3">
      <RouterLink :to="profileLink">
        <img :src="profileImage" alt="profile-image"
          class="aspect-square w-[50px] rounded-full transition-all hover:scale-105">
      </RouterLink>
      <RouterLink :to="profileLink">
        <span class="text-lg hidden md:block transition-all hover:underline underline-offset-4">
          {{ username }}
        </span>
      </RouterLink>
      <div class="absolute left-1/2 -translate-x-1/2 flex items-center">
        <h2 class="text-4xl whitespace-nowrap">just cube</h2>
      </div>
    </div>
  </header>
</template>
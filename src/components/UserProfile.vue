<script setup lang="ts">
  import { API } from '@/utils/api';
  import type { User } from '@/utils/types'
  import { ofetch } from 'ofetch';
  import { ref } from 'vue';

  const { user } = defineProps<{ user: User}>()

  const error = ref<any>(null)

  const [ followersCount, followingCount ] = await getCount()

  async function getCount(): Promise<[number, number]> {
    try {
      const [ followersResponse, followingResponse ] = await Promise.all(
        [
          ofetch<{ followers_count: number }>(API + `/users/followers/${ user.id }`),
          ofetch<{ following_count: number }>(API + `/users/following/${ user.id }`)
        ]
      )
      return [ followersResponse.followers_count, followingResponse.following_count ]
    } catch(e) {
      return [0, 0]
    }
  }
</script>

<template>
  <div class="p-3 md:p-5 lg:p-10">
    <div class="flex gap-5 items-center">
      <img
        src="https://placehold.co/200"
        alt="user profile picture"
        class="rounded-full w-1/3 max-w-[150px] aspect-square"
      >
      <div>
        <h1 class="font-bold text-4xl">{{ user.username }}</h1>
        <div class="flex gap-3 mt-1">
          <button
            class="flex flex-col items-center"
          >
            <p class="text-xl">following</p>
            <span class="text-2xl font-bold font-sans">{{ followingCount }}</span>
          </button>
          <button 
            class="flex flex-col items-center"
          >
            <p class="text-xl">followers</p>
            <span class="text-2xl font-bold font-sans">{{ followersCount }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ofetch } from 'ofetch'

import { API } from '@/utils/api'

import type { User } from '@/utils/types'

const { user } = defineProps<{ user: User }>()

const { followersCount, followingCount} = await getCount()

async function getCount() {
  try {
    const [{ followers_count }, { following_count }] = await Promise.all(
      [
        ofetch<{ followers_count: number }>(API + `/users/followers/count/${user.id}`),
        ofetch<{ following_count: number }>(API + `/users/following/count/${user.id}`)
      ]
    )
    return {
      followersCount: followers_count,
      followingCount: following_count,
    }
  } catch (e) {
    return {
      followersCount: 0,
      followingCount: 0,
    }
  }
}
</script>

<template>
  <div class="p-3 md:p-5 lg:p-10">
    <div class="flex gap-5 items-center">
      <img src="https://placehold.co/200" alt="user profile picture"
        class="rounded-full w-1/3 max-w-[150px] aspect-square">
      <div>
        <h1 class="font-bold text-4xl">{{ user.username }}</h1>
        <div class="flex gap-3 mt-1">
          <button class="flex flex-col items-center">
            <p class="text-xl">following</p>
            <span class="text-2xl font-bold font-sans">{{ followingCount }}</span>
          </button>
          <button class="flex flex-col items-center">
            <p class="text-xl">followers</p>
            <span class="text-2xl font-bold font-sans">{{ followersCount }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
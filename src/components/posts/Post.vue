<script setup lang="ts">
import { formatDate } from '@/utils/date'

import type { Post } from '@/utils/types'

import UserPreview from '../users/UserPreview.vue'
import PostImages from './PostImages.vue'

const { post } = defineProps<{
  post: Post
}>()
</script>

<template>
  <article class="w-full p-3 rounded-2xl bg-neutral-900">
    <div class="flex justify-between items-center w-full">
      <UserPreview :user="post.user" />
      <div class="hidden md:block">
        <p> {{ formatDate(post.created_at) }} </p>
      </div>
    </div>
    <h3 class="mt-3 text-lg">
      {{ post.text_content }}
    </h3>
    <div v-if="post.image_count > 0" class="pt-3">
      <PostImages :id="post.id" :imageCount="post.image_count" />
    </div>
    <slot />
  </article>
</template>
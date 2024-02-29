<script setup lang="ts">
  import { toDate, formatDate } from '@/utils/date'

  import type { Post } from '@/utils/types'

  const { post } = defineProps<{
    post: Post
  }>()

  import UserPreview from '../users/UserPreview.vue'
  import PostImages from './PostImages.vue'
  import PostFooter from './PostFooter.vue'
</script>

<template>
  <article class="w-full p-3 rounded-2xl bg-neutral-900" >
    <div class="flex justify-between items-center w-full">
      <UserPreview :user="post.user"/>
      <div class="hidden md:block">
        <p> {{ formatDate(toDate(post.created_at)) }} </p>
      </div>
    </div>
    <div class="mt-3 text-lg">
      {{ post.text_content }}
    </div>
    <div v-if="post.image_count > 0" class="pt-3">
      <PostImages :id="post.id" :imageCount="post.image_count"/>
    </div>
    <div>
      <PostFooter :id="post.id"/>
    </div>
  </article>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { ofetch } from 'ofetch'

  import { toDate, formatDate, timeSince } from '@/utils/date'
  import { API, createAuthHeader } from '@/utils/api'
  import { useSessionStore } from '@/stores/session'

  import type { Post, PostComment, User } from '@/utils/types'

  const { post } = defineProps<{
    post: Post
  }>()

  import UserPreview from './UserPreview.vue'
  import PostImages from './PostImages.vue'
  import PostComments from './PostComments.vue'
</script>

<template>
  <article class="w-full p-3 rounded-2xl bg-neutral-900">
    <div class="flex justify-between items-center w-full">
      <UserPreview :user="post.user"/>
      <div class="hidden md:block">
        <p> {{ formatDate(toDate(post.created_at)) }} </p>
      </div>
    </div>
    <div class="mt-3 text-lg">
      {{ post.text_content }}
    </div>
    <div class="pt-3">
      <PostImages :id="post.id" :imageCount="post.image_count"/>
    </div>
    <div>
      <PostComments :id="post.id"/>
    </div>
  </article>
</template>
<script setup lang="ts">
import { timeSince } from '@/utils/date'

import type { PostComment } from '@/utils/types'

import CommentFooter from './CommentFooter.vue'

const { comment } = defineProps<{
  comment: PostComment
}>()
</script>

<template>
  <p>
    <RouterLink
      :to="`/users/${ comment.user.id }`"
      class="mr-1 text-md text-white font-bold cursor-pointer hover:underline"
    >
      {{ comment.user.username }}
    </RouterLink>
    <span>
      {{ comment.content }}
    </span>
    <span class="ml-1 text-sm text-gray-400">
      {{ timeSince(comment.created_at) }}
    </span>
  </p>
  <CommentFooter :comment="comment" />
</template>
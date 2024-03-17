<script setup lang="ts">
import { timeSince, toDate } from '@/utils/date'

import type { PostComment } from '@/utils/types'

import CommentReplies from './CommentReplies.vue'

const { comment } = defineProps<{ comment: PostComment }>()
</script>

<template>
  <p>
    <RouterLink
      :to="`/users/${ comment.user.id }`"
      class="mr-1 text-md text-white font-bold cursor-pointer hover:underline"
    >
      {{ comment.user.username }}
    </RouterLink>

    {{ comment.content }}

    <span class="text-sm text-gray-400">
      {{ timeSince(comment.created_at) }}
    </span>
  </p>
  <CommentReplies :comment="comment" />
</template>
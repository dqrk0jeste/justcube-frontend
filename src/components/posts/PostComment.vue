<script setup lang="ts">
  import { timeSince, toDate } from '@/utils/date'

  import type { PostComment } from '@/utils/types'

  import CommentReplies from './CommentReplies.vue'

  const { comment } = defineProps<{ comment: PostComment}>()
</script>

<template>
  
  <RouterLink
    :to="`/users/${ comment.user.id }`"
    class="inline mr-2 text-md text-white font-bold cursor-pointer hover:underline"
  >
    {{ comment.user.username }}
  </RouterLink>

  <p class="inline line-height-3">
    {{ comment.content }}
    <span class="text-sm text-gray-400">
      {{ timeSince(toDate(comment.created_at)) }}
    </span>
  </p>

  <span class="ml-1 text-white">&middot;</span>
  <button class="text-gray-400 ml-1 text-sm hover:underline underline-offset-2">reply</button>

  <CommentReplies v-if="comment.number_of_replies > 0" :id="comment.id" />

</template>
<script setup lang="ts">
  import { timeSince, toDate } from '@/utils/date'

  import type { PostComment } from '@/utils/types'

  import CommentReplies from './CommentReplies.vue'

  const { comment } = defineProps<{ comment: PostComment}>()
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
      {{ timeSince(toDate(comment.created_at)) }}
    </span>
    <!-- TODO: this should probably change -->
    <span class="ml-1 text-gray-400">&middot;</span>
    <button class="text-gray-400 ml-1 text-sm hover:underline underline-offset-2">reply</button>
  </p>

  <CommentReplies v-if="comment.number_of_replies > 0" :id="comment.id" />
</template>
<script setup lang="ts">
import { timeSince } from '@/utils/date'
import { type CommentReply } from '@/utils/types'

const { reply } = defineProps<{
  reply: CommentReply,
}>()
</script>

<template>
  <p class="ml-3">
    <RouterLink :to="`/users/${reply.user.id}`"
      class="mr-1 text-md text-white font-bold cursor-pointer hover:underline">
      {{ reply.user.username }}
    </RouterLink>
    <span>
      {{ reply.content }}
    </span>
    <span class="ml-1 text-sm text-gray-400">
      {{ timeSince(reply.created_at) }}
    </span>
  </p>
</template>
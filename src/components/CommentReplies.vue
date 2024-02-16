<script setup lang="ts">
  import { ref } from 'vue'
  import { ofetch } from 'ofetch'

  import { API } from '@/utils/api'
  import { timeSince, toDate } from '@/utils/date'

  import type { CommentReply } from '@/utils/types'

  const DEFAULT_PAGE_SIZE = 5

  const { id } = defineProps<{
    id: string,
  }>()

  const repliesOpened = ref<boolean>(false)

  const replies = ref<CommentReply[]>([])

  const repliesPageNumber = ref<number>(1)
  const hasMoreReplies = ref<boolean>(true)

  const getRepliesPending = ref<boolean>(false)
  const getRepliesError = ref<any>(null)

  fetchReplies()

  async function fetchReplies() {
    try {
      getRepliesPending.value = true
      const newReplies = await ofetch<CommentReply[]>(API + '/posts/comments/replies', {
        query: {
          comment_id: id,
          page_number: repliesPageNumber.value,
          page_size: DEFAULT_PAGE_SIZE,
        },
      })

      if(newReplies.length < DEFAULT_PAGE_SIZE) {
        hasMoreReplies.value = false
      }

      repliesPageNumber.value++
      getRepliesError.value = null
      replies.value.push(...newReplies)
    } catch(e) {
      getRepliesError.value = e
    }
    getRepliesPending.value = false
  }

  function openReplies() {
    repliesOpened.value = true
  }

</script>

<template>
  <button  v-if="!repliesOpened" @click="openReplies()" class="block text-md ml-3 text-gray-300 hover:underline underline-offset-2">see replies</button>
  <div v-else class="px-3">

    <p v-if="getRepliesError" class="text-red-500">there has been an error loading replies</p>

    <div class="space-y-1">

      <div v-for="reply in replies" :key="reply.id">

        <RouterLink :to="`/users/${ reply.user.id }`" class="inline mr-2 text-md text-white font-bold cursor-pointer hover:underline">
          {{ reply.user.username }}
        </RouterLink>

        <p class="inline line-height-3">
          {{ reply.content }}
          <span class="text-sm text-gray-400">
            {{ timeSince(toDate(reply.created_at)) }}
          </span>
        </p>

      </div>

    </div>

    <p v-if="hasMoreReplies && !getRepliesPending" @click="fetchReplies()" class="ml-5 text-blue-200 cursor-pointer hover:underline underline-offset-2">see more...</p>
    <box-icon v-if="getRepliesPending" name="loader-circle" animation="spin"></box-icon>

  </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { ofetch } from 'ofetch'

import { API, createAuthHeader } from '@/utils/api'
import { timeSince, toDate } from '@/utils/date'
import { useCurrentUser } from '@/composables/useCurrentUser'

import type { CommentReply, PostComment, PostComment as PostCommentType, User } from '@/utils/types'

const PAGE_SIZE = 5
const MAX_REPLY_LENGTH = 200

const { comment } = defineProps<{
  comment: PostComment,
}>()

const currentUser = useCurrentUser()

const repliesOpened = ref<boolean>(false)
const isReplying = ref<boolean>(false)
const internalNumberOfReplies = ref<number>(comment.number_of_replies)

const replies = ref<CommentReply[]>([])

const { error: getRepliesError, isFetching: isFetchingReplies, hasMoreReplies, fetchMore } = useReplies()

const { reply, error: sendReplyError, isFetching: isSendingReply, sendReply } = useSendReply()

type useRepliesReturn = {
  error: Ref<any>,
  isFetching: Ref<boolean>,
  hasMoreReplies: Ref<boolean>,
  fetchMore: () => void,
}

function useReplies(): useRepliesReturn {
  const error = ref<any>(null)
  const isFetching = ref<boolean>(false)
  const hasMoreReplies = ref<boolean>(true)

  let pageNumber = 1

  async function _fetchReplies() {
    try {
      isFetching.value = true
      const newReplies = await ofetch<CommentReply[]>(API + '/posts/comments/replies', {
        query: {
          comment_id: comment.id,
          page_number: pageNumber,
          page_size: PAGE_SIZE,
        },
      })

      if (newReplies.length < PAGE_SIZE) {
        hasMoreReplies.value = false
      }

      error.value = null
      replies.value.push(...newReplies)
      pageNumber++
    } catch (e) {
      error.value = e
      setTimeout(() => {
        error.value = null
      }, 3000)
    } finally {
      isFetching.value = false
    }
  }

  _fetchReplies()

  return {
    error,
    isFetching,
    hasMoreReplies,
    fetchMore: _fetchReplies,
  }
}

type useSendReplyReturn = {
  reply: Ref<string>,
  error: Ref<any>,
  isFetching: Ref<boolean>,
  sendReply: () => void,
}

function useSendReply(): useSendReplyReturn {
  const reply = ref<string>('')
  const error = ref<any>(null)
  const isFetching = ref<boolean>(false)

  async function sendReply() {
    try {
      isFetching.value = true
      const data = await ofetch<PostCommentType>(API + '/posts/comments/replies', {
        method: 'POST',
        body: {
          content: reply.value,
          comment_id: comment.id,
        },
        headers: {
          authorization: createAuthHeader(currentUser.value.accessToken as string)
        }
      })
      const newReply = {
        id: data.id,
        content: data.content,
        user: currentUser.value.userInfo as User,
        created_at: data.created_at,
      }
      replies.value.push(newReply)
      internalNumberOfReplies.value++
      reply.value = ''
    } catch (e) {
      error.value = e
      setTimeout(() => {
        error.value = null
      }, 3000)
    } finally {
      isFetching.value = false
    }
  }

  return {
    reply,
    error,
    isFetching,
    sendReply,
  }
}

function checkForEnter(e: KeyboardEvent) {
  if (e.key !== 'Enter' || reply.value.length < 1) return;
  sendReply()
}
</script>

<template>
  <div>
    <button
      @click="isReplying = true"
      class="text-sm text-gray-400 ml-3 hover:underline underline-offset-2"
    >
      reply
    </button>
    <button
      @click="repliesOpened = !repliesOpened"
      class="text-sm text-gray-400 ml-2 hover:underline underline-offset-2"
    > 
      {{ internalNumberOfReplies ? 'show' : 'no' }} replies
    </button>
  </div>
  <div v-if="isReplying" class="ml-3 border-b border-white flex has-[:focus]:border-blue-300 transition-all">
    <input
      v-model="reply"
      @keypress="checkForEnter"
      :placeholder="currentUser.isGuest ? 'please login to reply' : `reply to ${ comment.user.username }`"
      type="text"
      :maxlength="MAX_REPLY_LENGTH"
      :disabled="currentUser.isGuest"
      class="min-w-0 w-full bg-transparent outline-none px-2"
    >
    <button
      @click="sendReply()"
      class="flex items-center justify-center p-2 hover:scale-110 transition-all"
      :disabled="currentUser.isGuest || isSendingReply || reply.length < 1"
    >
      <box-icon v-if="isSendingReply" name="loader-circle" animation="spin" color="white"></box-icon>
      <box-icon v-else name="navigation" color="white"></box-icon>
    </button>
  </div>
</template>

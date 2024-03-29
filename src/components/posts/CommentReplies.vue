<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { ofetch } from 'ofetch'

import { API, createAuthHeader } from '@/utils/api'
import { timeSince } from '@/utils/date'
import { useCurrentUser } from '@/composables/useCurrentUser'

import type { CommentReply, PostComment, PostComment as PostCommentType, User } from '@/utils/types'

const PAGE_SIZE = 5
const MAX_REPLY_LENGTH = 200

const { comment } = defineProps<{
  comment: PostComment,
}>()

defineEmits<{
  wantsToReply: [comment: PostComment],
}>()

const currentUser = useCurrentUser()

const repliesOpened = ref<boolean>(false)
const isReplying = ref<boolean>(false)
const internalNumberOfReplies = ref<number>(comment.number_of_replies)

const replies = ref<CommentReply[]>([])

const { error: getRepliesError, isFetching: isFetchingReplies, hasMoreReplies, fetchMore } = useReplies()

const { reply, error: sendReplyError, isFetching: isSendingReply, sendReply } = useSendReply()

const repliesButtonText = computed(() => {
  if(internalNumberOfReplies.value === 0) {
    return 'no replies'
  }
  if(repliesOpened.value) {
    return 'hide replies'
  }
  if(internalNumberOfReplies.value === 1) {
    return 'show reply'
  }
  return 'show replies'
})

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
      @click="$emit('wantsToReply', comment)"
      class="text-sm text-gray-400 ml-3 hover:underline underline-offset-2"
    >
      reply
    </button>
    <button
      @click="repliesOpened = !repliesOpened"
      class="text-sm text-gray-400 ml-2 hover:underline underline-offset-2"
    > 
      {{ repliesButtonText }}
    </button>
  </div>
  <!-- <div v-if="isReplying" class="ml-3 mb-2 border-b border-white flex items-center has-[:focus]:border-blue-300 transition-all">
    <button
      @click="isReplying = false"
      class="flex items-center justify-center hover:scale-110"
    >
      <box-icon name="x" size="sm" color="white"></box-icon>
    </button>
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
      @click="sendReply"
      class="flex items-center justify-center p-2 hover:scale-110 transition-all"
      :disabled="currentUser.isGuest || isSendingReply || reply.length < 1"
    >
      <box-icon v-if="isSendingReply" name="loader-circle" animation="spin" color="white"></box-icon>
      <box-icon v-else name="navigation" color="white"></box-icon>
    </button>
  </div> -->
  <div v-if="repliesOpened">
    <div class="space-y-1">
      <article 
        v-for="reply in replies"
        :key="reply.id"
        class="ml-3"
      >
        <p>
          <RouterLink
            :to="`/users/${ reply.user.id }`"
            class="mr-1 text-md text-white font-bold cursor-pointer hover:underline"
          >
            {{ reply.user.username }}
          </RouterLink>
  
          {{ reply.content }}
  
          <span class="text-sm text-gray-400">
            {{ timeSince(reply.created_at) }}
          </span>
        </p>
      </article>
    </div>
    <p
      v-if="hasMoreReplies && !isFetchingReplies"
      @click="fetchMore()"
      class="ml-3 text-blue-200 cursor-pointer hover:underline underline-offset-2"
    >
      see more...
    </p>
    <div v-else-if="isFetchingReplies" class="pl-3 h-6">
      <box-icon name="loader-circle" animation="spin" color="white"></box-icon>
    </div>
  </div>
</template>

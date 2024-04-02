<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import { ofetch } from 'ofetch'

import { API, createAuthHeader } from '@/utils/api'
import { useCurrentUser } from '@/composables/useCurrentUser'

import type { CommentReply, PostComment, User } from '@/utils/types'

import CommentReplyComp from './CommentReply.vue'
import { newToastNotification } from '@/composables/useToast'

const PAGE_SIZE = 5
const MAX_REPLY_LENGTH = 200

const { comment } = defineProps<{
  comment: PostComment,
}>()

const currentUser = useCurrentUser()

const repliesOpened = ref(false)
const hasReplies = ref(comment.number_of_replies === 0 ? false : true)

const currentInput = inject('input-holder') as Ref<string>
const isReplying = computed(() => currentInput.value === comment.id)

const {
  replies,
  isFetching: isFetchingReplies,
  hasMoreReplies,
  fetchMore,
} = useReplies()

const {
  reply,
  isFetching: isSendingReply,
  sendReply,
} = useSendReply()

const repliesButtonText = computed(() => {
  if(hasReplies.value === false) {
    return 'no replies'
  }
  if(repliesOpened.value) {
    return 'hide replies'
  }
  return 'show replies'
})

type useRepliesReturn = {
  replies: Ref<CommentReply[]>,
  error: Ref<any>,
  isFetching: Ref<boolean>,
  hasMoreReplies: Ref<boolean>,
  fetchMore: () => void,
}

function useReplies(): useRepliesReturn {
  const replies = ref<CommentReply[]>([])
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
      
      const newRepliesFilltered = newReplies.filter((reply) => !alreadyHasId(reply.id))
      error.value = null
      replies.value.push(...newRepliesFilltered)
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
    replies,
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
      const data = await ofetch<PostComment>(API + '/posts/comments/replies', {
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
      hasReplies.value = true
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

function handleReplying() {
  if(currentUser.value.isGuest) {
    newToastNotification({
      heading: 'you are not logged in',
      paragraph: 'please log in to reply'
    })
    return;
  }
  currentInput.value = comment.id
  document.querySelector('.comment-input-area')?.scrollIntoView({ behavior: 'smooth' })
}

function checkForEnter(e: KeyboardEvent) {
  if (e.key !== 'Enter' || reply.value.length < 1) return;
  sendReply()
}

function alreadyHasId(id: string): boolean {
  for(let i = 0; i < replies.value.length; i++) {
    if(replies.value[i].id === id) {
      return true
    } 
  }
  return false
} 
</script>

<template>
  <div>
    <button
      @click="handleReplying"
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
  <div v-if="repliesOpened">
    <div class="space-y-1">
      <article v-for="reply in replies" :key="reply.id">
        <CommentReplyComp :reply="reply"/>
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
  <Teleport v-if="isReplying" to=".comment-input-area">
    <div class="pt-2 border-b border-white flex has-[:focus]:border-blue-300 transition-all">
      <button
        @click="currentInput = 'base'"
        class="flex items-center px-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
      >
        <box-icon name="x" color="white"></box-icon>
        <span>{{ comment.user.username }}</span>
      </button>
      <input
        v-model="reply"
        @keypress="checkForEnter"
        placeholder="leave a reply..."
        type="text"
        :maxlength="MAX_REPLY_LENGTH"
        class="min-w-0 w-full bg-transparent outline-none px-2 text-lg"
      >
      <button
        @click="sendReply"
        class="flex items-center justify-center p-2 hover:scale-110 transition-all"
        :disabled="isSendingReply || reply.length < 1"
      >
        <box-icon v-if="isSendingReply" name="loader-circle" animation="spin" color="white"></box-icon>
        <box-icon v-else name="navigation" color="white"></box-icon>
      </button>
    </div>
  </Teleport>
</template>

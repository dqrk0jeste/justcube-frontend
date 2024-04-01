<script setup lang="ts">
import { provide, ref, type InjectionKey, type Ref } from 'vue'
import { ofetch } from 'ofetch'

import { API, createAuthHeader } from '@/utils/api'
import { useCurrentUser } from '@/composables/useCurrentUser'

import type { PostComment, User } from '@/utils/types'

import PostCommentComp from './PostComment.vue'
import { ERROR_MESSAGE, newToastNotification } from '@/composables/useToast'

const PAGE_SIZE = 5
const MAX_COMMENT_LENGTH = 200

const { id } = defineProps<{
  id: string
}>()

const currentUser = useCurrentUser()

const {
  comments,
  isFetching: isFetchingComments,
  hasMoreComments,
  fetchMore
} = useComments()

const {
  comment,
  isFetching: isSendingComment,
  sendComment
} = useSendComment()

const currentInput = ref('base')
provide(`input-holder`, currentInput)

type useCommentsReturn = {
  comments: Ref<PostComment[]>
  error: Ref<any>,
  isFetching: Ref<boolean>,
  hasMoreComments: Ref<boolean>,
  fetchMore: () => void,
}

function useComments(): useCommentsReturn {
  const comments = ref<PostComment[]>([])
  const error = ref<any>(null)
  const isFetching = ref<boolean>(false)
  const hasMoreComments = ref<boolean>(true)

  let pageNumber = 1

  async function _fetchComments() {
    try {
      isFetching.value = true
      const newComments = await ofetch<PostComment[]>(API + '/posts/comments', {
        query: {
          post_id: id,
          page_number: pageNumber,
          page_size: PAGE_SIZE,
        },
      })

      if (newComments.length < PAGE_SIZE) {
        hasMoreComments.value = false
      }

      error.value = null
      comments.value.push(...newComments)
      pageNumber++
    } catch (e) {
      error.value = e
      newToastNotification(ERROR_MESSAGE)
    } finally {
      isFetching.value = false
    }
  }

  _fetchComments()

  return {
    comments,
    error,
    isFetching,
    hasMoreComments,
    fetchMore: _fetchComments,
  }
}

type useSendCommentReturn = {
  comment: Ref<string>,
  error: Ref<any>,
  isFetching: Ref<boolean>,
  sendComment: () => void,
}

function useSendComment(): useSendCommentReturn {
  const comment = ref<string>('')
  const error = ref<any>(null)
  const isFetching = ref<boolean>(false)

  async function sendComment() {
    try {
      isFetching.value = true
      const data = await ofetch<PostComment>(API + '/posts/comments', {
        method: 'POST',
        body: {
          content: comment.value,
          post_id: id,
        },
        headers: {
          authorization: createAuthHeader(currentUser.value.accessToken as string)
        }
      })
      const newComment = {
        id: data.id,
        content: data.content,
        user: currentUser.value.userInfo as User,
        number_of_replies: 0,
        created_at: data.created_at,
      }
      comments.value = [newComment, ...comments.value]
      comment.value = ''
    } catch (e) {
      error.value = e
      newToastNotification(ERROR_MESSAGE)
    } finally {
      isFetching.value = false
    }
  }

  return {
    comment,
    error,
    isFetching,
    sendComment,
  }
}

function checkForEnter(e: KeyboardEvent) {
  if (e.key !== 'Enter' || comment.value.length < 1) return;
  sendComment()
}

function sharePost() {
  navigator.clipboard.writeText(location.origin + '/posts/' + id)
  console.log(location.origin + '/posts/' + id)
}
</script>

<template>
  <div class="border-t border-white mt-6">
    <div v-if="comments.length > 0" class="pt-3 pl-3">
      <div class="space-y-1 divide-y divide-gray-500">
        <article v-for="comment in comments" :key="comment.id">
          <PostCommentComp :comment="comment" />
        </article>
      </div>
      <p 
        v-if="hasMoreComments && !isFetchingComments" @click="fetchMore"
        class=" text-blue-200 cursor-pointer hover:underline underline-offset-2"
      >
        see more...
      </p>
      <div v-else-if="isFetchingComments" class="pl-3 h-6">
        <box-icon name="loader-circle" animation="spin" color="white"></box-icon>
      </div>
    </div>
    <p v-if="comments.length === 0" class="pl-3 pt-3">no comments yet. be the first one to comment</p>

    <div class="comment-input-area">
      <div
        v-if="currentInput === 'base'"
        class="pt-2 border-b border-white flex has-[:focus]:border-blue-300 transition-all"
      >
        <input
          v-model="comment"
          @keypress="checkForEnter"
          :placeholder="currentUser.isGuest ? 'please login to comment' : 'leave a comment...'"
          type="text"
          :maxlength="MAX_COMMENT_LENGTH"
          :disabled="currentUser.isGuest"
          class="min-w-0 w-full bg-transparent outline-none px-2 text-lg"
        >
        <button
          @click="sendComment"
          class="flex items-center justify-center p-2 hover:scale-110 transition-all"
          :disabled="currentUser.isGuest || isSendingComment || comment.length < 1"
        >
          <box-icon v-if="isSendingComment" name="loader-circle" animation="spin" color="white"></box-icon>
          <box-icon v-else name="navigation" color="white"></box-icon>
        </button>
      </div>
    </div>
  </div>
</template>
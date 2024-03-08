<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { ofetch } from 'ofetch'
import { useRoute, useRouter } from 'vue-router'

import { API, createAuthHeader } from '@/utils/api'
import { useCurrentUser } from '@/composables/useCurrentUser'

import type { Post as PostType, PostComment as PostCommentType, User } from '@/utils/types'

import PostComment from './PostComment.vue'

const { id } = defineProps<{ id: string }>()


const DEFAULT_PAGE_SIZE = 10
const MAX_COMMENT_LENGTH = 200

const currentUser = useCurrentUser()

const comments = ref<PostCommentType[]>([])

const { error: getCommentsError, isFetching: isFetchingComments, hasMoreComments, fetchMore } = useComments()

const { comment, error: sendCommentError, isFetching: isSendingComment, sendComment } = useSendComment()

type useCommentsReturn = {
  error: Ref<any>,
  isFetching: Ref<boolean>,
  hasMoreComments: Ref<boolean>,
  fetchMore: () => void,
}

function useComments(): useCommentsReturn {
  const error = ref<any>(null)
  const isFetching = ref<boolean>(false)
  const hasMoreComments = ref<boolean>(true)

  let pageNumber = 1

  async function _fetchComments() {
    try {
      isFetching.value = true
      const newComments = await ofetch<PostCommentType[]>(API + '/posts/comments', {
        query: {
          post_id: id,
          page_number: pageNumber,
          page_size: DEFAULT_PAGE_SIZE,
        },
      })

      if (newComments.length < DEFAULT_PAGE_SIZE) {
        hasMoreComments.value = false
      }

      error.value = null
      comments.value.push(...newComments)
      pageNumber++
    } catch (e) {
      error.value = e
    } finally {
      isFetching.value = false
    }
  }

  _fetchComments()

  return {
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
      const data = await ofetch<PostCommentType>(API + '/posts/comments', {
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
      setTimeout(() => {
        error.value = null
      }, 3000)
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
  
// TODO: when chats are added this thing should improve 
function sharePost() {
  navigator.clipboard.writeText(location.origin + '/posts/' + id)
  console.log(location.origin + '/posts/' + id)
}
</script>

<template>
  <!-- <div class="pt-3 flex justify-end gap-3">
    <input
      v-if="commentsOpened"
      v-model="comment"
      @keypress="checkForEnter"
      :placeholder="currentUser.isGuest ? 'please login to comment' : 'leave a comment...'"
      class="flex-1 outline-none rounded-full text-black px-5 py-3 min-w-0"
      type="text"
      :maxlength="MAX_COMMENT_LENGTH"
      :disabled="currentUser.isGuest"
    >
    <button
      v-if="commentsOpened"
      @click="sendComment()"
      class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15"
      :disabled="currentUser.isGuest || isSendingComment || comment.length < 1"
    >
      <box-icon name="loader-circle" v-if="isSendingComment" animation="spin"></box-icon>
      <box-icon name="navigation" color="white" v-else></box-icon>
    </button>
    <button
      @click="sharePost()"
      class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15"
    >
      <box-icon name="share" color="white"></box-icon>
    </button>
    <button
      @click="commentsOpened = !commentsOpened"
      class="flex items-center gap-2 w-[50px] justify-center aspect-square rounded-full transition-color"
      :class="commentsOpened ? 'bg-blue-200 hover:bg-blue-300' : 'bg-white/10 hover:bg-white/15'"
    >
      <box-icon v-if="commentsOpened" name="x" color="black" size="md"></box-icon>
      <box-icon v-else name="message-square-dots" color="white"></box-icon>
    </button>
  </div> --->
  <div>
    <div class="space-y-1">
      <article v-for="comment in comments" :key="comment.id">
        <PostComment :comment="comment" />
      </article>
    </div>
  </div>

  <!-- <div v-show="commentsOpened" class="px-3 pt-3">

    <p v-if="getCommentsError" class="text-red-500">there has been an error loading comments</p>
    <p v-else-if="comments.length === 0">no comments yet. be the first one to comment</p>

    <div class="space-y-1">

      <div v-for="comment in comments" :key="comment.id">
        <PostComment :comment="comment" />
      </div>

    </div>

    <p v-if="hasMoreComments && !isFetchingComments" @click="fetchMore()"
      class="ml-5 text-blue-200 cursor-pointer hover:underline underline-offset-2">
      see more...
    </p>
    <box-icon name="loader-circle" v-if="isFetchingComments" animation="spin"></box-icon>

  </div>
  <div class="w-full flex gap-3 items-center justify-end mt-3">

    <input
      v-if="commentsOpened"
      v-model="comment"
      @keypress="checkForEnter"
      :placeholder="currentUser.isGuest ? 'please login to comment' : 'leave a comment...'"
      class="flex-1 outline-none rounded-full text-black px-5 py-3 min-w-0"
      type="text"
      :maxlength="MAX_COMMENT_LENGTH"
      :disabled="currentUser.isGuest"
    >

    <button v-if="commentsOpened" @click="sendComment()"
      class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15"
      :disabled="currentUser.isGuest || isSendingComment || comment.length < 1">
      <box-icon name="loader-circle" v-if="isSendingComment" animation="spin"></box-icon>
      <box-icon name="navigation" color="white" v-else></box-icon>
    </button>

  </div>

  <p v-if="commentsOpened && sendCommentError" class="ml-5 mt-3 text-red-500">
    there has been an error, please try again
  </p> -->
</template>
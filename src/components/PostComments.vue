<script setup lang="ts">
  import { ref } from 'vue'
  import { ofetch } from 'ofetch'
  import { storeToRefs } from 'pinia'

  import { toDate, timeSince } from '@/utils/date'
  import { API, createAuthHeader } from '@/utils/api'
  import { useSessionStore } from '@/stores/session'

  import type { Post, PostComment, User } from '@/utils/types'

  const DEFAULT_PAGE_SIZE = 5
  const MAX_COMMENT_LENGTH = 200

  const { id } = defineProps<{
    id: string
  }>()

  const sessionStore = useSessionStore()
  const { user: currentUser } = storeToRefs(sessionStore)

  const commentsOpened = ref<boolean>(false)
  const commentsPageNumber  = ref<number>(1)
  const comments = ref<PostComment[]>([])
  const noMoreComments = ref<boolean>(false)

  const comment = ref<string>('')
  const sendCommentError = ref<any>(null)
  const sendingComment = ref<boolean>(false)

  fetchComments()

  // DONE
  async function fetchComments() {
    try {
      const newComments = await ofetch<PostComment[]>(API + '/posts/comments', {
        query: {
          post_id: id,
          page_number: commentsPageNumber.value,
          page_size: DEFAULT_PAGE_SIZE,
        },
      })
      if(newComments.length < DEFAULT_PAGE_SIZE) {
        noMoreComments.value = true
      }

      commentsPageNumber.value++
      comments.value = comments.value.concat(newComments)
    } catch(e) {
      console.log(e)
    }
  }

  // DONE
  function openComments() {
    commentsOpened.value = true
  }

  // DONE
  function closeComments() {
    commentsOpened.value = false
  }

  // TODO: check authorization in some way, add loading state
  async function sendComment() {
    try {
      sendingComment.value = true
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
      comments.value.unshift({
        id: data.id,
        content: data.content,
        user: sessionStore.user.userInfo as User,
        created_at: data.created_at,
      })
      sendingComment.value = false
      comment.value = ''
    } catch(e) {
      sendingComment.value = false
      sendCommentError.value = e
      setTimeout(() => {
        sendCommentError.value = null
      }, 3000)
    }
  }

  // DONE
  function checkForEnter(e: KeyboardEvent) {
    if(e.key !== 'Enter') return;
    sendComment()
  }
  
  // TODO: when chats are added this thing should improve 
  function sharePost() {
    navigator.clipboard.writeText(location.origin + '/posts/' + id)
    console.log(location.origin + '/posts/' + id)
  }

</script>

<template>
  <div v-if="commentsOpened" class="px-3 pt-3">
    <p v-if="comments.length === 0">no comments yet. be the first one to comment</p>
    <div class="mb-1" v-for="comment in comments" :key="comment.id">
      <RouterLink :to="`/users/${ comment.user.id }`" class="inline mr-2 text-md text-white font-bold cursor-pointer hover:underline">
        {{ comment.user.username }}
      </RouterLink>
      <p class="inline line-height-3">
        {{ comment.content }}
        <span class="text-sm text-gray-400">
          {{ timeSince(toDate(comment.created_at)) }}
        </span>
      </p>
    </div>
    <p v-if="!noMoreComments" @click="fetchComments()" class="ml-5 text-blue-200 cursor-pointer hover:underline underline-offset-2">load more...</p>
  </div>
  <div class="w-full flex gap-3 items-center justify-end mt-3">
    <input @keypress="checkForEnter" v-model="comment" v-if="commentsOpened" :placeholder="currentUser.isGuest ? 'please login to comment' : 'leave a comment...'" class="flex-1 outline-none rounded-full text-black px-5 py-3" type="text" :maxlength="MAX_COMMENT_LENGTH" :disabled="currentUser.isGuest">
    <button v-if="commentsOpened" @click="sendComment()" class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15" :disabled="currentUser.isGuest">
      <i v-if="sendingComment" class='bx bx-loader-circle bx-spin text-2xl'></i>
      <i v-else class='bx bx-navigation text-2xl'></i>
    </button>
    <button @click="sharePost()" class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15">
      <i class='bx bx-share text-2xl'></i>
    </button>
    <button v-if="commentsOpened" @click="closeComments()" class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-blue-200 rounded-full transition-color hover:bg-blue-300">
      <i class='bx bx-x text-4xl text-black'></i>
    </button>
    <button v-if="!commentsOpened" @click="openComments()" class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15">
      <i class='bx bx-message-square-dots text-2xl'></i>
    </button>
  </div>
  <div v-if="commentsOpened && sendCommentError" class="ml-5 mt-3 text-red-500">there has been an error, please try again</div>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ofetch } from 'ofetch'
  import { useRoute } from 'vue-router'

  import { toDate, formatDate, timeSince } from '@/utils/date'
  import { API, createAuthHeader } from '@/utils/api'
  import { useSessionStore } from '@/stores/session'

  import type { Post, PostComment, User } from '@/utils/types'

  import UserPreview from './UserPreview.vue'
  import PostImages from './PostImages.vue'

  const DEFAULT_PAGE_SIZE = 5

  const { post } = defineProps<{
    post: Post
  }>()

  const route = useRoute()

  const commentsPageNumber  = ref<number>(1)
  const comments = ref<PostComment[]>([])
  const myCommentsCount = ref<number>(0)
  // const commentsCount = computed(() => comments.value.length - myCommentsCount.value)
  const noMoreComments = ref<boolean>(false)
  const commentsOpened = ref<boolean>(false)
  const comment = ref<string>('')

  fetchComments()

  async function fetchComments() {
    try {
      const newComments = await ofetch<PostComment[]>(API + '/posts/comments', {
        query: {
          post_id: post.id,
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

  function openComments() {
    commentsOpened.value = true
  }

  function closeComments() {
    commentsOpened.value = false
  }

  // TODO: check authorization in some way, add loading state
  async function sendComment() {
    try {
      const sessionStore = useSessionStore()
      const data = await ofetch<PostComment>(API + '/posts/comments', {
        method: 'POST',
        body: {
          content: comment.value,
          post_id: post.id,
        },
        headers: {
          authorization: createAuthHeader(sessionStore.user.accessToken as string)
        }
      })
      comments.value.unshift({
        id: data.id,
        content: data.content,
        user: sessionStore.user.userInfo as User,
        created_at: data.created_at,
      })

      myCommentsCount.value++
      setTimeout(() => comment.value = '', 3000)
    } catch(e) {

    }
    
  }

  function checkForEnter(e: KeyboardEvent) {
    if(e.key !== 'Enter') return;
    sendComment()
  }
  
  // TODO: when chats are added this thing should improve 
  function sharePost() {
    navigator.clipboard.writeText(location.origin + '/posts/' + post.id)
    console.log(location.origin + '/posts/' + post.id)
  }

</script>

<template>
  <article class="w-full p-3 rounded-2xl bg-neutral-900">
    <div class="flex justify-between items-center w-full">
      <UserPreview :user="post.user"/>
      <div class="hidden md:block">
        <p> {{ formatDate(toDate(post.created_at)) }} </p>
      </div>
    </div>
    <div class="mt-3 text-lg">
      {{ post.text_content }}
    </div>
    <div class="pt-3">
      <PostImages :id="post.id" :imageCount="post.image_count"/>
    </div>
    <div v-if="commentsOpened" class="px-3 pt-3">
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
      <p v-if="!noMoreComments" @click="fetchComments()" class="text-blue-200 cursor-pointer text-center hover:underline underline-offset-2">load more...</p>
    </div>
    <div class="w-full flex gap-3 items-center justify-end mt-3">
      <input @keypress="checkForEnter" v-model="comment" v-if="commentsOpened" placeholder="leave a comment..." class="flex-1 outline-none rounded-full text-black px-5 py-3" type="text">
      <button v-if="commentsOpened" @click="sendComment()" class="flex items-center gap-2 w-[50px] justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15">
        <i class='bx bx-navigation text-2xl'></i>
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
  </article>
</template>
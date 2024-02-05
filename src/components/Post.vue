<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Post, PostComment } from '@/utils/types'
  import { toDate, formatDate, timeSince } from '@/utils/date'

  import UserPreview from './UserPreview.vue'

  const { post } = defineProps<{
    post: Post
  }>()

  const commentsCount = ref<number>(1)
  const comments = ref<PostComment[]>([])

  const query = computed(() => {
    return {
      post_id: post.id,
      page_number: commentsCount.value,
      page_size: 5,
    }
  })

  const commentsOpened = ref<boolean>(false)
  const comment = ref<string>('')

  function openComments() {
    commentsOpened.value = true
  }

  function closeComments() {
    commentsOpened.value = false
  }

  // TODO
  function sendComment() {
    // do something meaningful here
    console.log(comment.value)

    comment.value = ''
  }
  
  // TODO
  function sharePost() {
    // copy the id something something
    console.log(post.id)
  }
</script>

<template>
  <article class="w-full max-w-[800px] p-3 mb-5 rounded-2xl bg-neutral-800">
    <div class="flex justify-between items-center w-full">
      <UserPreview :user="post.user"/>
      <div class="hidden md:block">
        <p>
          {{ formatDate(toDate(post.created_at)) }}
        </p>
      </div>
    </div>
    <div class="mt-3 text-lg">
      {{ post.text_content }}
    </div>
    <!-- TODO: add images here -->
    <div v-if="commentsOpened" class="px-3 pt-3">
      <div class="bg-white h-[1px] w-1/2 mb-3"></div>
      <div class="mb-1" v-for="comment in comments" :key="comment.id">
        <NuxtLink :to="`/users/${comment.user.username}`" class="inline mr-2 text-md text-white font-bold cursor-pointer hover:underline">
          {{ comment.user.username }}
        </NuxtLink>
        <p class="inline line-height-3">
          {{ comment.content }}
          <span class="text-sm text-gray-400">
            {{ timeSince(toDate(comment.created_at)) }}
          </span>
        </p>
      </div>
      <p @click="commentsCount++" class="text-blue-200 cursor-pointer text-center hover:underline underline-offset-2">read more...</p>
    </div>
    <div class="w-full flex gap-3 items-center justify-end mt-3">
      <input v-model="comment" v-if="commentsOpened" placeholder="leave a comment..." class="flex-1 outline-none rounded-full text-black px-5 py-3" type="text">
      <button v-if="commentsOpened" @click="sendComment()" class="flex items-center gap-2 w-[50px] flex items-center justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15">
        <i class='bx bx-navigation text-2xl'></i>
      </button>
      <button @click="sharePost()" class="flex items-center gap-2 w-[50px] flex items-center justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15">
        <i class='bx bx-share text-2xl'></i>
      </button>
      <button v-if="commentsOpened" @click="closeComments()" class="flex items-center gap-2 w-[50px] flex items-center justify-center aspect-square bg-blue-200 rounded-full transition-color hover:bg-blue-300">
        <i class='bx bx-x text-4xl text-black'></i>
      </button>
      <button v-if="!commentsOpened" @click="openComments()" class="flex items-center gap-2 w-[50px] flex items-center justify-center aspect-square bg-white/10 rounded-full hover:bg-white/15">
        <i class='bx bx-message-square-dots text-2xl'></i>
      </button>
    </div>
  </article>
</template>
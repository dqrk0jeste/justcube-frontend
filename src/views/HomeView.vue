<script setup lang="ts">
  import { ref } from 'vue'
  import { ofetch } from 'ofetch'
  import { useTitle } from '@vueuse/core'
  import { storeToRefs } from 'pinia'

  import { useSessionStore } from '@/stores/session'
  import { API, createAuthHeader } from '@/utils/api'

  import type { Post as PostType } from '@/utils/types'

  import Post from '@/components/Post.vue'

  const title = useTitle()
  title.value = "let's cube | home"

  const DEFAULT_PAGE_SIZE = 10

  const sessionStore = useSessionStore()
  const { user: currentUser } = storeToRefs(sessionStore)

  const posts = ref<PostType[]>([])
  const error = ref<any>(null)
  const pageNumber = ref<number>(1)

  await fetchPosts()

  async function fetchPosts() {
    if(currentUser.value.isGuest) {
      try {
        const newPosts = await ofetch<PostType[]>(API + '/posts/guest-feed', {
          query: {
            page_number: pageNumber.value,
            page_size: DEFAULT_PAGE_SIZE,
          },
        })
        posts.value = posts.value.concat(newPosts)
        pageNumber.value++
      } catch(e) {
        console.log(e)
        error.value = e
      }
    } else {
      try {
        const newPosts = await ofetch<PostType[]>(API + '/posts/feed', {
          query: {
            page_number: pageNumber.value,
            page_size: DEFAULT_PAGE_SIZE,
          },
          headers: {
            authorization: createAuthHeader(currentUser.value.accessToken as string),
          }
        })
        posts.value = posts.value.concat(newPosts)
        pageNumber.value++
      } catch(e) {
        console.log(e)
        error.value = e
      }
    }
  }
</script>

<template>
  <div v-if="error" class="grid place-items-center py-10 text-xl">
    there has been an error.
    <button @click="fetchPosts" class="hover:underline underline-offset-2 text-blue-200">
      try again?
    </button>
  </div>
  <div v-else class="this space-y-3 md:space-y-5 h-full overflow-y-auto p-3">
    <div v-for="post in posts" :key="post.id">
      <Post :post="post"/>
    </div>
  </div>
  
</template>

<style scoped>
 .this::-webkit-scrollbar {
    width: 5px;
  }

  .this::-webkit-scrollbar-track {
    background-color: transparent;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .this::-webkit-scrollbar-thumb {
    background-color: gray;
    border-radius: 5px;
  }
  
</style>
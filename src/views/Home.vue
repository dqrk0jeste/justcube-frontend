<script setup lang="ts">
  import { ref } from 'vue'
  import { ofetch } from 'ofetch'
  import { useTitle } from '@vueuse/core'
  import { useSessionStore } from '@/stores/session'
  import type { Post as PostType } from '@/utils/types'
  import { API, createAuthHeader } from '@/utils/api'

  import Post from '@/components/Post.vue'

  const title = useTitle()
  title.value = "let's cube | home"

  const DEFAULT_PAGE_SIZE = 10

  const sessionStore = useSessionStore()
  const currentUser = sessionStore.user

  const posts = ref<PostType[]>([])
  const pageNumber = ref<number>(1)

  if(currentUser.isGuest) {
    try {
      const newPosts = await ofetch<PostType[]>(API + '/posts/guest-feed', {
        query: {
          page_number: pageNumber.value,
          page_size: DEFAULT_PAGE_SIZE,
        },
      })
      posts.value = posts.value.concat(newPosts)
    } catch(e) {
      console.log(e)
    }
  } else {
    try {
      const newPosts = await ofetch<PostType[]>(API + '/posts/feed', {
        query: {
          page_number: pageNumber.value,
          page_size: DEFAULT_PAGE_SIZE,
        },
        headers: {
          authorization: createAuthHeader(currentUser.accessToken as string),
        }
      })
      posts.value = posts.value.concat(newPosts)
    } catch(e) {
      console.log(e)
    }
  }
    // return useFetch<Post[]>(useApi() + '/posts/feed', {
    //   query: {
    //     page_number: page_number,
    //     page_size: DEFAULT_PAGE_SIZE,
    //   },
    //   transform: (newPosts) => {
    //     posts.value = posts.value.concat(newPosts)
    //     return newPosts
    //   },
    //   headers: {
    //     authorization: 'Bearer ' + currentUser.value.accessToken
    //   },
    // })
</script>

<template>
  <div class="this h-full overflow-y-auto p-3 md:p-5 bg-neutral-900">
    <div v-for="post in posts" :key="post.id">
      <Post :post="post"/>
    </div>
    <!-- TODO: make these nicer -->
    <!-- <div v-if="newPostsPending">loading...</div>
    <div v-else-if="newPostsError">there has been an error</div>
    <button @click="page_number++" class="border-white border-2 p-3">FETCH MORE POSTS</button> -->
  </div>
</template>

<style scoped>
 .this::-webkit-scrollbar {
    width: 5px;
  }

  .this::-webkit-scrollbar-track {
    background-color: transparent;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .this::-webkit-scrollbar-thumb {
    background-color: gray;
    border-radius: 5px;
  }
</style>
<script setup lang="ts">
  import { ref, watch, type Ref, } from 'vue'
  import { ofetch } from 'ofetch'
  import { until, useFetch, useTitle } from '@vueuse/core'
  import { storeToRefs } from 'pinia'

  import { useSessionStore } from '@/stores/session'
  import { API, createAuthHeader } from '@/utils/api'

  import type { Post as PostType } from '@/utils/types'

  import Post from '@/components/posts/Post.vue'

  const title = useTitle()
  title.value = `let's cube | home`

  const DEFAULT_PAGE_SIZE = 10

  const sessionStore = useSessionStore()
  const { user: currentUser } = storeToRefs(sessionStore)

  const { posts, error, fetchMore } = await useFetchPosts()

  type useFetchPostsReturn = {
    posts: Ref<PostType[]>,
    error: Ref<any>,
    fetchMore: () => void,
  }

  function useFetchPosts(): PromiseLike<useFetchPostsReturn> {
    const posts = ref<PostType[]>([])
    const error = ref<any>(null)
    const isFetching = ref<boolean>(false)

    let pageNumber = 1

    watch(currentUser, () => {
      posts.value = []
      pageNumber = 1
      _fetchPosts()
    })
    
    async function _fetchPosts() {
      isFetching.value = true
      if(currentUser.value.isGuest) {
        try {
          const newPosts = await ofetch<PostType[]>(API + '/posts/guest-feed', {
            query: {
              page_number: pageNumber,
              page_size: DEFAULT_PAGE_SIZE,
            },
          })
          posts.value.push(...newPosts)
          error.value = null
          pageNumber++
        } catch(e) {
          console.log(e)
          error.value = e
        }
      } else {
        try {
          const newPosts = await ofetch<PostType[]>(API + '/posts/feed', {
            query: {
              page_number: pageNumber,
              page_size: DEFAULT_PAGE_SIZE,
            },
            headers: {
              authorization: createAuthHeader(currentUser.value.accessToken as string),
            }
          })
          posts.value.push(...newPosts)
          error.value = null
          pageNumber++
        } catch(e) {
          console.log(e)
          error.value = e
        }
      }
      isFetching.value = false
    }

    _fetchPosts()

    const promise = new Promise<useFetchPostsReturn>(async (resolve) => {
      await until(isFetching).toBe(false)
      return resolve({
        posts,
        error,
        fetchMore: _fetchPosts,
      })
    })

    return {
      then(resolved) {
        return promise.then(resolved)
      }
    }
  }
</script>

<template>
  <div v-if="error" class="text-center py-10 text-xl">
    there has been an error.
    <button @click="fetchMore()" class="hover:underline underline-offset-2 text-blue-200">
      try again?
    </button>
  </div>
  <div v-else class="this space-y-3 md:space-y-5 h-full overflow-y-auto px-3">
    <div v-for="post in posts" :key="post.id">
      <Post :post="post"/>
    </div>
    <button @click="fetchMore()">click</button>
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
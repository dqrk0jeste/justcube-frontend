<script setup lang="ts">
  import { ref, watch, type Ref, } from 'vue'
  import { ofetch } from 'ofetch'
  import { until, useFetch, useInfiniteScroll, useTitle } from '@vueuse/core'
  import { storeToRefs } from 'pinia'

  import { useSessionStore } from '@/stores/session'
  import { API, createAuthHeader } from '@/utils/api'

  import type { Post as PostType } from '@/utils/types'

  import Post from '@/components/posts/Post.vue'
  import PostFooterFeed from '@/components/posts/PostFooterFeed.vue'

  const PAGE_SIZE = 10

  const sessionStore = useSessionStore()
  const { user: currentUser } = storeToRefs(sessionStore)

  const { posts, error, fetchMore, hasMorePosts } = await useFetchPosts()

  const feed = ref<HTMLDivElement>()

  const { isLoading } = useInfiniteScroll(document, fetchMore, {
    distance: 50,
    canLoadMore: () => hasMorePosts.value,
  })

  type useFetchPostsReturn = {
    posts: Ref<PostType[]>,
    error: Ref<any>,
    fetchMore: () => void,
    hasMorePosts: Ref<boolean>
  }

  function useFetchPosts(): PromiseLike<useFetchPostsReturn> {
    const posts = ref<PostType[]>([])
    const error = ref<any>(null)
    const isFetching = ref<boolean>(false)
    const hasMorePosts = ref<boolean>(true)

    let pageNumber = 1

    watch(() => currentUser.value.userInfo, () => {
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
              page_size: PAGE_SIZE,
            },
          })
          if(newPosts.length < PAGE_SIZE) {
            hasMorePosts.value = false
          }
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
              page_size: PAGE_SIZE,
            },
            headers: {
              authorization: createAuthHeader(currentUser.value.accessToken as string),
            }
          })
          if(newPosts.length < PAGE_SIZE) {
            hasMorePosts.value = false
          }
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

    return new Promise<useFetchPostsReturn>(async (resolve) => {
      await until(isFetching).toBe(false)
      return resolve({
        posts,
        error,
        fetchMore: _fetchPosts,
        hasMorePosts,
      })
    })
  }
</script>

<template>
  <div ref="feed" class="space-y-3 md:space-y-5">
    <div v-for="post in posts" :key="post.id">
      <Post :post="post">
        <PostFooterFeed :id="post.id" />  
      </Post>
    </div>
    <div v-if="isLoading" class="w-full text-center">
      <box-icon name="loader-circle" animation="spin" color="white"></box-icon>
    </div>
    <div v-if="error" class="text-center py-10 text-xl">
      there has been an error.
      <button @click="fetchMore()" class="hover:underline underline-offset-2 text-blue-200">
        try again?
      </button>
    </div>
    
  </div>
</template>

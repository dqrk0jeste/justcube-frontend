<script setup lang="ts">
import { ref, watch, type Ref, } from 'vue'
import { ofetch } from 'ofetch'
import { until, useInfiniteScroll, whenever } from '@vueuse/core'

import { useCurrentUser } from '@/composables/useCurrentUser'
import { ERROR_MESSAGE, newToastNotification } from '@/composables/useToast'
import { API, createAuthHeader } from '@/utils/api'

import type { Post as PostType } from '@/utils/types'

import Post from '@/components/posts/Post.vue'
import PostFooterFeed from '@/components/posts/PostFooterFeed.vue'

const PAGE_SIZE = 10

const currentUser = useCurrentUser()
const { posts, error, fetchMore, hasMorePosts } = await useFetchPosts()

const { isLoading } = useInfiniteScroll(document, fetchMore, {
  distance: 50,
  canLoadMore: () => hasMorePosts.value && !error.value,
})

type useFetchPostsReturn = {
  posts: Ref<PostType[]>,
  error: Ref<any>,
  fetchMore: () => void,
  hasMorePosts: Ref<boolean>
}

async function useFetchPosts(): Promise<useFetchPostsReturn> {
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

  whenever(error, () => newToastNotification(ERROR_MESSAGE))
  
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
        error.value = e
      }
    }
    isFetching.value = false
  }

  await _fetchPosts()

  return {
    posts,
    error,
    fetchMore: _fetchPosts,
    hasMorePosts,
  }
}
</script>

<template>
  <div class="space-y-3 md:space-y-5">
    <div v-for="post in posts" :key="post.id">
      <Post :post="post">
        <PostFooterFeed :id="post.id" />  
      </Post>
    </div>
    <div v-if="isLoading" class="w-full text-center">
      <box-icon name="loader-circle" animation="spin" color="white"></box-icon>
    </div>
  </div>
</template>

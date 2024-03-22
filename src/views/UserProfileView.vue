<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { ofetch } from 'ofetch'
import { until, useInfiniteScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

import { API } from '@/utils/api'

import type { Post as PostType, User } from '@/utils/types'

import Post from '@/components/posts/Post.vue'
import UserProfile from '@/components/users/UserProfile.vue'
import PostFooterFeed from '@/components/posts/PostFooterFeed.vue'

const PAGE_SIZE = 1

const user = await getUser()
const { posts, error, fetchMore, hasMorePosts } = await useFetchPosts()
const { isLoading } = useInfiniteScroll(document, fetchMore, {
  distance: 50,
  canLoadMore: () => hasMorePosts.value,
})

type useFetchPostsReturn = {
  posts: Ref<PostType[]>,
  error: Ref<any>,
  fetchMore: () => void,
  hasMorePosts: Ref<boolean>,
}

async function useFetchPosts(): Promise<useFetchPostsReturn> {
  const posts = ref<PostType[]>([])
  const error = ref<any>(null)
  const isFetching = ref<boolean>(false)
  const hasMorePosts = ref<boolean>(true)

  if (!user) {
    return new Promise<useFetchPostsReturn>((resolve) => {
      return resolve({
        posts,
        error,
        fetchMore: () => {},
        hasMorePosts,
      })
    })
  }

  let pageNumber = 1

  async function _fetchPosts() {
    isFetching.value = true
    try {
      const newPosts = await ofetch<PostType[]>(API + '/posts', {
        query: {
          user_id: user?.id,
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
    } catch (e) {
      console.log(e)
      error.value = e
    } finally {
      isFetching.value = false
    }
  }

  await _fetchPosts()

  return {
    posts,
    error,
    fetchMore: _fetchPosts,
    hasMorePosts,
  }
}

async function getUser(): Promise<User | null> {
  const route = useRoute()
  const router = useRouter()
  const userId = route.params.id
  try {
    const user = await ofetch<User>(API + `/users/${ userId }`)
    return user
  } catch (e: any) {
    if (e.status === 404) {
      router.replace({
        name: '404',
      })
      return null
    }
    router.replace({
      name: '404',
    })
    return null
  }
}
</script>

<template>
  <template v-if="user">
    <div class="this space-y-3 md:space-y-5 h-full overflow-y-auto px-3">
      <UserProfile :user="user" />
      <div v-for="post in posts" :key="post.id">
        <Post :post="post">
          <PostFooterFeed :id="post.id" />
        </Post>
      </div>
      <div v-if="isLoading" class="w-full text-center">
        <box-icon name="loader-circle" animation="spin" color="white"></box-icon>
      </div>
      <!-- TODO: may need to change this -->
      <div v-if="error" class="text-center py-10 text-xl">
        there has been an error.
        <button @click="fetchMore()" class="hover:underline underline-offset-2 text-blue-200">
          try again?
        </button>
      </div>
    </div>
  </template>
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
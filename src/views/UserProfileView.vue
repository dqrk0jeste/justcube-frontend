<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { ofetch } from 'ofetch'
import { until } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

import { API } from '@/utils/api'

import type { Post as PostType, User } from '@/utils/types'

import Post from '@/components/posts/Post.vue'
import UserProfile from '@/components/users/UserProfile.vue'
import PostFooterFeed from '@/components/posts/PostFooterFeed.vue'

const DEFAULT_PAGE_SIZE = 10

const user = await getUser()

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

  if (!user) {
    return new Promise<useFetchPostsReturn>((resolve) => {
      return resolve({
        posts,
        error,
        fetchMore: () => { },
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
          page_size: DEFAULT_PAGE_SIZE,
        },
      })
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

  _fetchPosts()

  return new Promise<useFetchPostsReturn>(async (resolve) => {
    await until(isFetching).toBe(false)
    return resolve({
      posts,
      error,
      fetchMore: _fetchPosts,
    })
  })
}

async function getUser() {
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
      <!-- TODO: may need to change this when i implement infinite scroll -->
      <div v-if="error" class="text-center py-10 text-xl">
        there has been an error.
        <button @click="fetchMore()" class="hover:underline underline-offset-2 text-blue-200">
          try again?
        </button>
      </div>
      <!-- TODO: fix this -->
      <button @click="fetchMore()">click</button>
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
<script setup lang="ts">
  import { ref } from 'vue'
  import { ofetch } from 'ofetch'
  import { useTitle } from '@vueuse/core'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'

  import { useSessionStore } from '@/stores/session'
  import { API } from '@/utils/api'

  import type { Post as PostType, User } from '@/utils/types'

  import Post from '@/components/Post.vue'
  import UserProfile from '@/components/UserProfile.vue'

  const route = useRoute()
  const userId = route.params.id

  const user = await getUser()

  const title = useTitle()
  title.value = `let's cube | ${ user?.username || 'not found' }`

  const DEFAULT_PAGE_SIZE = 10

  const sessionStore = useSessionStore()
  const { user: currentUser } = storeToRefs(sessionStore)

  const posts = ref<PostType[]>([])
  const error = ref<any>(null)
  const pageNumber = ref<number>(1)

  await fetchPosts()

  async function fetchPosts() {
    try {
      const newPosts = await ofetch<PostType[]>(API + '/posts', {
        query: {
          user_id: userId,
          page_number: pageNumber.value,
          page_size: DEFAULT_PAGE_SIZE,
        },
      })
      posts.value.push(...newPosts)
      error.value = null
      pageNumber.value++
    } catch(e) {
      console.log(e)
      error.value = e
    }
  }

  async function getUser() {
    try {
      const user = await ofetch<User>(API + `/users/${userId}`)
      return user
    } catch(e) {
      error.value = e
    }
  }
</script>

<template>
  <div v-if="error || !user" class="text-center py-10 text-xl">
    there has been an error.
    <!-- TODO -->
    <button @click="" class="hover:underline underline-offset-2 text-blue-200">
      try again?
    </button>
  </div>
  <div v-else class="this space-y-3 md:space-y-5 h-full overflow-y-auto px-3">
    <UserProfile :user="user"/>
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
<script setup lang="ts">
import { ofetch } from 'ofetch'
import { useRoute, useRouter } from 'vue-router'

import { API } from '@/utils/api'

import type { Post as PostType } from '@/utils/types'

import Post from '@/components/posts/Post.vue'
import PostFooterSinglePost from '@/components/posts/PostFooterSinglePost.vue'

const id = getPostId()
const post = await getPost()

async function getPost() {
  try {
    const post = await ofetch<PostType>(API + `/posts/${id}`)
    return post
  } catch (e: any) {
    const router = useRouter()
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

function getPostId(): string {
  return useRoute().params.id as string
}

</script>

<template>
  <template v-if="post">
    <div class="h-full overflow-y-auto">
      <Post :post="post">
        <PostFooterSinglePost :id="id" />
      </Post>
    </div>
  </template>
</template>
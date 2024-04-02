<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { ofetch } from 'ofetch'

import { ERROR_MESSAGE, newToastNotification } from '@/composables/useToast'
import { API } from '@/utils/api'

import type { User } from '@/utils/types'

import UserPreview from './UserPreview.vue'

const PAGE_SIZE = 20

const { user } = defineProps<{
  user: User,
}>()

const {
  followers,
  error: followersError,
  isFetching: isFetchingFollowers,
  fetchMore: fetchMoreFollowers,
  hasMoreFollowers,
} = useFollowers()

const {
  following,
  error: followingError,
  isFetching: isFetchingFollowing,
  fetchMore: fetchMoreFollowing,
  hasMoreFollowing,
} = useFollowing()

type useFollowersReturn = {
  followers: Ref<User[]>,
  error: Ref<any>,
  isFetching: Ref<boolean>,
  fetchMore: () => void,
  hasMoreFollowers: Ref<boolean>,
}

function useFollowers(): useFollowersReturn {
  const followers = ref([] as User[])
  const error = ref<any>(null as any)
  const isFetching = ref(false)
  const hasMoreFollowers = ref(true)

  let pageNumber = 1

  async function _fetchFollowers() {
    isFetching.value = true
    error.value = null
    try {
      const newFollowers = await ofetch<User[]>(API + `/users/followers`, {
        query: {
          user_id: user.id,
          page_number: pageNumber,
          page_size: PAGE_SIZE,
        },
      })

      if (newFollowers.length < PAGE_SIZE) {
        hasMoreFollowers.value = false
      }

      followers.value.push(...newFollowers)
      pageNumber++
    } catch (e) {
      error.value = e
      newToastNotification(ERROR_MESSAGE)
    } finally {
      isFetching.value = false
    }
  }

  _fetchFollowers()

  return {
    followers,
    error,
    isFetching,
    fetchMore: _fetchFollowers,
    hasMoreFollowers,
  }

}

type useFollowingReturn = {
  following: Ref<User[]>,
  error: Ref<any>,
  isFetching: Ref<boolean>,
  fetchMore: () => void,
  hasMoreFollowing: Ref<boolean>,
}

function useFollowing(): useFollowingReturn {
  const following = ref([] as User[])
  const error = ref<any>(null as any)
  const isFetching = ref(false)
  const hasMoreFollowing = ref(true)

  let pageNumber = 1

  async function _fetchFollowing() {
    isFetching.value = true
    error.value = null
    try {
      const newFollowing = await ofetch<User[]>(API + `/users/following`, {
        query: {
          user_id: user.id,
          page_number: pageNumber,
          page_size: PAGE_SIZE,
        },
      })

      if (newFollowing.length < PAGE_SIZE) {
        hasMoreFollowing.value = false
      }

      following.value.push(...newFollowing)
      pageNumber++
    } catch (e) {
      error.value = e
      newToastNotification(ERROR_MESSAGE)
    } finally {
      isFetching.value = false
    }
  }

  _fetchFollowing()

  return {
    following,
    error,
    isFetching,
    fetchMore: _fetchFollowing,
    hasMoreFollowing,
  }

}

</script>

<template>
  <div class="py-3 w-full flex gap-3 flex-row">
    <div>
      <h2 class="text-xl">followers</h2>
      <div v-for="follower in followers" :key="follower.id">
        <UserPreview :user="follower" />
      </div>
    </div>
    <div>
      <h2 class="text-xl">following</h2>
      <div v-for="user in following" :key="user.id">
        <UserPreview :user="user" />
      </div>
    </div>
  </div>
</template>
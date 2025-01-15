<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-8">User Profile</h1>
    <client-only>
      <LoadingIndicator v-if="userStore.loading" />
      <ErrorDisplay v-if="userStore.error" :error="userStore.error" />
      <div v-if="userStore.currentUser" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Username
          </label>
          <p id="username" class="text-gray-900">{{ userStore.currentUser.username }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <p id="email" class="text-gray-900">{{ userStore.currentUser.email }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="fullName">
            Full Name
          </label>
          <p id="fullName" class="text-gray-900">{{ userStore.currentUser.fullName }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="linkedinAddress">
            LinkedIn Address
          </label>
          <p id="linkedinAddress" class="text-gray-900">{{ userStore.currentUser.linkedinAddress || 'Not provided' }}</p>
        </div>
      </div>
      <div v-else-if="!userStore.loading && !userStore.error" class="text-center text-gray-600">
        Please log in to view your profile
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import LoadingIndicator from '~/components/LoadingIndicator.vue'
import ErrorDisplay from '~/components/ErrorDisplay.vue'

const userStore = useUserStore()

onMounted(() => {
  if (userStore.currentUser?.id) {
    userStore.fetchCurrentUser()
  }
})
</script>

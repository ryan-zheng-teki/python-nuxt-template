<template>
  <div>
    <div v-if="userStore.isAuthenticated" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Welcome, {{ userStore.currentUser?.username }}!</h2>
      <button
        @click="handleLogout"
        class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>

      <button
        @click="handleBuySubscription"
        class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300 mt-4"
      >
        Buy Subscription (Demo)
      </button>

      <button
        @click="handleGenerateApiKey"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 mt-4"
      >
        Generate API Key
      </button>

      <div v-if="userStore.apiKey" class="mt-4 p-4 bg-gray-100 border border-gray-400 rounded">
        <p class="text-gray-800 break-all">
          <strong>Your New API Key:</strong> {{ userStore.apiKey }}
        </p>
        <p class="text-sm text-gray-600">Store this key safely. We do NOT store it again!</p>
      </div>

      <button
        @click="downloadLibrary"
        class="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-300 mt-4"
      >
        Download Library
      </button>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Please log in or sign up</h2>
      <LoginForm :user-store="userStore" @login-error="handleLoginError" />
      <button
        @click="handleShowSignUp"
        class="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
      >
        Sign Up
      </button>
      <p v-if="loginError" class="mt-4 text-red-600 bg-red-100 border border-red-400 rounded p-2">
        {{ loginError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'
import LoginForm from '~/components/LoginForm.vue'
import { gql, useQuery } from '@vue/apollo-composable'
import { onMounted } from 'vue'

const props = defineProps<{  userStore: ReturnType<typeof useUserStore>
}>()

const emit = defineEmits(['logout', 'showSignUp'])
const loginError = ref('')

// GraphQL query to get the download URL
const DOWNLOAD_LIBRARY_URL = gql`
  query GetDownloadLibraryUrl {
    downloadLibraryUrl
  }
`

const { result, loading, error, refetch } = useQuery(DOWNLOAD_LIBRARY_URL)

const handleLogout = () => {
  props.userStore.logout()
  emit('logout')
}

const handleShowSignUp = () => {
  emit('showSignUp')
}

const handleLoginError = (error: string) => {
  loginError.value = error
}

const downloadLibrary = async () => {
  try {
    // Refetch the download URL to ensure it's up-to-date
    const { data } = await refetch()
    const downloadUrl = data.value?.downloadLibraryUrl
    if (downloadUrl) {
      // Initiate the download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'libmylibrary.so' // The desired file name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('Download URL not available.')
    }
  } catch (err) {
    console.error('Error fetching download URL:', err)
    alert('Failed to get download URL.')
  }
}

const handleBuySubscription = async () => {
  // For demonstration, we can pass a dummy plan type and duration (e.g., 30 days).
  await props.userStore.buySubscription('ProPlan', 30)
  if (props.userStore.error) {
    alert(props.userStore.error)
  } else {
    alert('Subscription purchased successfully!')
  }
}

const handleGenerateApiKey = async () => {
  await props.userStore.generateApiKey()
  if (props.userStore.error) {
    alert(props.userStore.error)
  }
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>

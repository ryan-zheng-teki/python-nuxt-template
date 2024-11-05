<template>
  <div class="min-h-screen bg-blue-50 flex flex-col justify-center items-center p-4">
    <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Please log in or sign up</h2>
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter your username"
          >
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter your password"
          >
        </div>
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Login
        </button>
        <button 
          type="button" 
          class="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300 transform hover:scale-105 mt-2"
          @click="handleSignUp"
        >
          Sign Up
        </button>
      </div>
    </form>
    <p class="mt-4 text-sm text-gray-600">Need help? <a href="#" class="text-blue-600 hover:underline">Contact support</a></p>
    <p v-if="error" class="mt-4 text-red-600 bg-red-100 border border-red-400 rounded p-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const emit = defineEmits(['login-error', 'signup-request'])

const username = ref('')
const password = ref('')
const error = ref('')

const userStore = useUserStore()

const handleSubmit = async () => {
  try {
    await userStore.login(username.value, password.value)
    if (userStore.isAuthenticated) {
      // Optionally, emit a successful login event
    } else {
      error.value = userStore.error || 'Login failed.'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred.'
    console.error('Login error:', err)
  }
}

const handleSignUp = () => {
  emit('signup-request')
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>
<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-8">Welcome to Linda</h1>
    <div v-if="userStore.isAuthenticated" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Welcome, {{ userStore.currentUser?.username }}!</h2>
      <button @click="logout" class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300">Logout</button>
    </div>
    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Please log in or sign up</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input id="username" v-model="loginForm.username" placeholder="Username" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" v-model="loginForm.password" type="password" placeholder="Password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">Login</button>
      </form>
      <button @click="showSignUpForm = true" class="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300">Sign Up</button>
    </div>
    <transition name="fade">
      <div v-if="showSignUpForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4">Sign Up</h2>
          <form @submit.prevent="signUp" class="space-y-4">
            <div>
              <label for="signup-username" class="block text-sm font-medium text-gray-700">Username</label>
              <input id="signup-username" v-model="signUpForm.username" placeholder="Username" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
            <div>
              <label for="signup-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input id="signup-email" v-model="signUpForm.email" placeholder="Email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
            <div>
              <label for="signup-fullname" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="signup-fullname" v-model="signUpForm.fullName" placeholder="Full Name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
            <div>
              <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
              <input id="signup-password" v-model="signUpForm.password" type="password" placeholder="Password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
            <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300">Sign Up</button>
          </form>
          <button @click="showSignUpForm = false" class="w-full mt-4 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition duration-300">Cancel</button>
        </div>
      </div>
    </transition>
    <div v-if="userStore.loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-lg font-semibold">Loading...</p>
      </div>
    </div>
    <div v-if="userStore.error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ userStore.error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: '',
})

const signUpForm = ref({
  username: '',
  email: '',
  fullName: '',
  password: '',
})

const showSignUpForm = ref(false)

const login = async () => {
  // Implement login logic here
  console.log('Login:', loginForm.value)
}

const logout = () => {
  // Implement logout logic here
  userStore.currentUser = null
}

const signUp = async () => {
  await userStore.createUser({
    username: signUpForm.value.username,
    email: signUpForm.value.email,
    fullName: signUpForm.value.fullName,
  })
  if (!userStore.error) {
    showSignUpForm.value = false
    // Optionally, log in the user automatically after sign up
  }
}

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
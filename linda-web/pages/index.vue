<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-8">Welcome to Linda</h1>
    
    <div v-if="userStore.isAuthenticated" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Welcome, {{ userStore.currentUser?.username }}!</h2>
      <button @click="logout" class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300">
        Logout
      </button>
    </div>
    
    <div v-else>
      <LoginForm 
        v-if="!showSignUpForm"
        @signup-request="showSignUpForm = true"
      />
      
      <SignUpForm
        v-if="showSignUpForm"
        :user-store="userStore"
        @close="showSignUpForm = false"
      />
    </div>

    <div v-if="userStore.loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-lg font-semibold">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'
import LoginForm from '~/components/LoginForm.vue'
import SignUpForm from '~/components/SignUpForm.vue'

const userStore = useUserStore()
const showSignUpForm = ref(false)

const logout = () => {
  userStore.logout()
  navigateTo('/')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-leave-to, .fade-enter-from {
  opacity: 0;
}
</style>

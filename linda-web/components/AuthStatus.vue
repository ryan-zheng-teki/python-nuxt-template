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

const props = defineProps<{  userStore: ReturnType<typeof useUserStore>
}>()

const emit = defineEmits(['logout', 'showSignUp'])
const loginError = ref('')

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
</script>

<style scoped>
/* Add any necessary styles here */
</style>

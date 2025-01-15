<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Sign Up</h2>
      <div v-if="props.userStore.error" class="mb-4 p-2 bg-red-100 text-red-700 rounded">
        {{ props.userStore.error }}
      </div>
      <form @submit.prevent="signUp" class="space-y-4">
        <div>
          <label for="signup-username" class="block text-sm font-medium text-gray-700">Username</label>
          <input 
            id="signup-username" 
            v-model="signUpForm.username" 
            placeholder="Username" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
        </div>
        <div>
          <label for="signup-email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="signup-email" 
            v-model="signUpForm.email" 
            type="email"
            placeholder="Email" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
        </div>
        <div>
          <label for="signup-fullname" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            id="signup-fullname" 
            v-model="signUpForm.fullName" 
            placeholder="Full Name" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
        </div>
        <div>
          <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            id="signup-password" 
            v-model="signUpForm.password" 
            type="password" 
            placeholder="Password" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
        </div>
        <button 
          type="submit" 
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
          :disabled="props.userStore.loading"
        >
          {{ props.userStore.loading ? 'Signing up...' : 'Sign Up' }}
        </button>
      </form>
      <button 
        @click="handleClose" 
        class="w-full mt-4 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition duration-300"
        :disabled="props.userStore.loading"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const props = defineProps<{  userStore: ReturnType<typeof useUserStore>
}>()

const emit = defineEmits(['close'])

const signUpForm = ref({
  username: '',
  email: '',
  fullName: '',
  password: '',
})

const signUp = async () => {
  await props.userStore.createUser({
    username: signUpForm.value.username,
    email: signUpForm.value.email,
    fullName: signUpForm.value.fullName,
    password: signUpForm.value.password,
  })
  
  if (!props.userStore.error) {
    // After successful signup and auto-login, navigate to profile
    await navigateTo('/profile')
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Create Restack Account</h2>
      <button
        class="text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
      >
        <span class="text-2xl">&times;</span>
      </button>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Username
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder="Username"
        v-model="form.username"
      />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="email"
        placeholder="Email"
        v-model="form.email"
      />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="fullName">
        Full Name
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="fullName"
        type="text"
        placeholder="Full Name"
        v-model="form.fullName"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder="******************"
        v-model="form.password"
      />
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        @click="signUp"
      >
        Create Account
      </button>
      <button
        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        @click="$emit('close')"
      >
        Back to Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['close']);
const props = defineProps({
  userStore: Object
});

const form = reactive({
  username: '',
  email: '',
  fullName: '',
  password: ''
});

const signUp = async () => {
  try {
    await props.userStore.signUp(
      form.username,
      form.email,
      form.fullName,
      form.password
    );
    emit('close');
  } catch (e) {
    console.error('Error signing up:', e);
  }
};
</script>

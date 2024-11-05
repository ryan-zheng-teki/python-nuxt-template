<template>
  <nav class="bg-blue-500 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-white text-xl font-bold">Linda</NuxtLink>
      <div>
        <NuxtLink v-if="userStore.isAuthenticated" to="/profile" class="text-white ml-4">Profile</NuxtLink>
        <NuxtLink v-else to="/login" class="text-white ml-4">Login</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
</script>
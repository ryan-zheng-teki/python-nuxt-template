<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col">
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

html, body, #__nuxt {
  height: 100%;
}

body {
  font-family: 'Roboto', sans-serif;
}
</style>
<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <!-- Header removed entirely -->
    <main class="flex-grow container mx-auto px-4 py-6">
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Critical for proper footer positioning */
html, body, #__nuxt, #__layout {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f8fafc; /* slate-50 */
}

body {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  color: #334155; /* slate-700 */
}

#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Ensure the main content area expands properly */
main {
  flex: 1 0 auto;
}

/* This ensures the footer doesn't float in the middle */
.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

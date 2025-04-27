<template>
  <div>
    <AtomVisualizer />
  </div>
</template>

<script setup lang="ts">
import AtomVisualizer from '~/components/AtomVisualizer.vue';

// Page metadata can be set here if needed using useHead
useHead({
  title: 'Interactive Atom Visualizer - AutoByteus Workshop',
  meta: [
    { name: 'description', content: 'Visualize atomic structures interactively using Three.js and Vue.' }
  ]
})

console.log('Visualizer page setup.');
</script>

<style scoped>
/* Page specific styles if any */
</style>

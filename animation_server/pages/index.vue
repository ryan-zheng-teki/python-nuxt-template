<template>
  <div class="w-full h-full min-h-screen bg-gray-100">
    <div class="container mx-auto py-8">
      <h1 class="text-3xl font-bold text-blue-700 mb-4 flex items-center gap-3">
        <fa :icon="['fas', 'compass']" class="text-blue-400" />
        Circle Circumference Animation
      </h1>
      <p class="mb-7 text-lg text-gray-700 max-w-2xl">
        Visualize the solution to: <span class="font-mono font-semibold">Calculate the circumference of a circle with radius 5 cm.</span>
      </p>
      <GeometryAnimation />
    </div>
  </div>
</template>

<script lang="ts" setup>
import GeometryAnimation from '~/components/GeometryAnimation.vue';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
</script>
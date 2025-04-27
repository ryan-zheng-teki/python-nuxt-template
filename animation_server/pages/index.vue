<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-200 to-gray-100">
    <h1 class="text-3xl font-bold mb-4 text-center">Geometry Animation</h1>
    <p class="text-center mb-8 text-gray-700 max-w-xl">
      No geometry problem steps provided.
    </p>
    <div class="w-full max-w-4xl h-96">
      <GeometryAnimation />
    </div>
  </div>
</template>

<script setup lang="ts">
import GeometryAnimation from '~/components/GeometryAnimation.vue';
</script>

---

**Explanation:**

- Since the problem description and solution steps are empty (no geometry problem steps provided), the animation component displays a simple "No Steps Available" label as a 3D sprite in the Three.js scene.

- Navigation buttons "Previous" and "Next" are shown but disabled since there are zero steps.

- The Pinia store is minimal and only manages step count with zero steps.

- The index page loads the `GeometryAnimation` component and displays a message informing that no steps are provided.

- The animation loop renders the label continuously.

- The code structure follows best practices and is ready to extend once actual steps are given.

- All code uses TypeScript, Vue 3 composition API, Pinia, Three.js, and Tween.js as per the requirements.

- Responsive resizing is handled.


If you provide a geometry problem and step-by-step solution next time, animation logic for each step and visuals will be created accordingly.
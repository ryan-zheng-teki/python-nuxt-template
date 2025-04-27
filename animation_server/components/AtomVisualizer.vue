<template>
  <div class="flex flex-col lg:flex-row h-screen bg-gray-100">
    <!-- Controls and Info Panel -->
    <div class="w-full lg:w-sidebar p-4 bg-white shadow-md overflow-y-auto flex flex-col">
      <h2 class="text-xl font-semibold mb-4 text-primary-dark flex items-center">
        <FontAwesomeIcon :icon="['fas', 'atom']" class="mr-2" />
        Atom Visualizer
      </h2>

      <!-- Element Selection -->
      <div class="mb-6">
        <label for="element-select" class="form-label">Select Element:</label>
        <select
          id="element-select"
          :value="store.selectedElementSymbol"
          @change="handleElementChange"
          class="form-select"
        >
          <option
            v-for="element in store.availableElements"
            :key="element.symbol"
            :value="element.symbol"
          >
            {{ element.atomicNumber }}. {{ element.name }} ({{ element.symbol }})
          </option>
        </select>
      </div>

      <!-- Element Information -->
      <div v-if="store.selectedElementData" class="mb-6 p-3 bg-gray-light rounded border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">{{ store.selectedElementData.name }} ({{ store.selectedElementData.symbol }})</h3>
        <p class="text-sm text-gray-700">Atomic Number: {{ store.selectedElementData.atomicNumber }}</p>
        <p class="text-sm text-gray-700">Electron Shells: {{ store.selectedElementData.shells.join(', ') }}</p>
      </div>

      <!-- Speed Control -->
      <div class="mb-6">
        <label class="form-label">Orbit Speed:</label>
        <div class="flex space-x-2">
          <button
            @click="store.setOrbitSpeed('slow')"
            :class="['btn btn-secondary btn-small', { 'bg-primary-light text-white border-primary-light': store.orbitSpeed === 'slow' }]"
            title="Slow Speed"
          >
            <FontAwesomeIcon :icon="['fas', 'backward']" />
            <span class="ml-1">Slow</span>
          </button>
          <button
            @click="store.setOrbitSpeed('normal')"
            :class="['btn btn-secondary btn-small', { 'bg-primary-light text-white border-primary-light': store.orbitSpeed === 'normal' }]"
            title="Normal Speed"
          >
            <FontAwesomeIcon :icon="['fas', 'play']" />
             <span class="ml-1">Normal</span>
          </button>
          <button
            @click="store.setOrbitSpeed('fast')"
            :class="['btn btn-secondary btn-small', { 'bg-primary-light text-white border-primary-light': store.orbitSpeed === 'fast' }]"
            title="Fast Speed"
          >
            <FontAwesomeIcon :icon="['fas', 'forward']" />
             <span class="ml-1">Fast</span>
          </button>
        </div>
      </div>

      <!-- Spacer to push potential future elements down -->
      <div class="flex-grow"></div>

      <!-- Instructions -->
       <div class="mt-auto text-xs text-gray-500 p-2 border-t border-gray-200">
          <p>Use your mouse/touch to rotate (drag) and zoom (scroll/pinch).</p>
       </div>
    </div>

    <!-- 3D Canvas Area -->
    <div class="flex-grow h-full w-full lg:w-auto">
      <canvas ref="canvasContainer" class="w-full h-full block"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAtomStore } from '~/stores/atomStore';
import { useThreeAtomVisualizer } from '~/composables/useThreeAtomVisualizer';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Needed for template usage

// Ensure icons are loaded (redundant if global plugin works, but safe)
import '~/plugins/fontawesome.js';

const store = useAtomStore();
const canvasContainer = ref<HTMLCanvasElement | null>(null);

console.log('AtomVisualizer component setup initiated.');

// Pass reactive refs to the composable
const selectedElementDataRef = computed(() => store.selectedElementData);
const speedMultiplierRef = computed(() => store.speedMultiplier);

// Initialize the visualizer using the composable
// The composable handles its own mounting and unmounting logic internally via onMounted/onUnmounted
useThreeAtomVisualizer(canvasContainer, selectedElementDataRef, speedMultiplierRef);

const handleElementChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  store.selectElement(target.value);
  console.log(`Element selection changed via UI to: ${target.value}`);
};

onMounted(() => {
  console.log('AtomVisualizer component mounted.');
  // Composables handle their own mount logic tied to the component lifecycle
});

onUnmounted(() => {
  console.log('AtomVisualizer component unmounted.');
   // Composables handle their own unmount logic tied to the component lifecycle
});
</script>

<style scoped>
/* Scoped styles if needed, primarily using Tailwind */
.h-screen {
  height: 100vh; /* Ensure full viewport height */
}

/* Ensure canvas takes up available space */
.flex-grow canvas {
    display: block; /* Remove potential extra space below canvas */
    width: 100%;
    height: 100%;
}

/* Style the active speed button */
.btn-secondary.bg-primary-light {
    border-color: #1890ff; /* Match primary color */
}

/* Adjust sidebar width for larger screens */
@media (min-width: 1024px) {
  .lg\:w-sidebar {
    width: 300px; /* Or use theme spacing: theme('spacing.sidebar') */
    flex-shrink: 0; /* Prevent sidebar from shrinking */
  }
}
</style>

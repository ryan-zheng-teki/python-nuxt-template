<template>
  <div ref="canvasHolderRef" class="relative w-full h-full min-h-[300px] bg-gray-100 rounded flex items-center justify-center">
    <!-- The Three.js canvas renders in here -->
    <div v-if="showLabels" class="absolute left-2 top-2 sm:left-5 sm:top-5 z-10 select-none">
      <!-- Main label for each step -->
      <div class="bg-white/80 p-3 rounded-lg shadow text-gray-800 font-medium text-base md:text-lg border border-blue-200" v-html="activeStepLabel"></div>
    </div>
    <!-- Final answer (floating box, step 4) -->
    <div
      v-if="currentStep >= 3"
      class="absolute right-2 top-6 sm:right-5 sm:top-10 z-20 select-none"
    >
      <div class="bg-green-50 border border-green-400 px-4 py-3 mt-2 rounded-lg shadow text-green-800 text-base font-bold max-w-xs">
        <div v-if="currentStep === 3 || currentStep === 4">
          Exact Circumference:
          <span class="inline-block font-mono bg-white px-2 py-1 mx-1 rounded text-base">10π&nbsp;cm</span>
          <br/>
          Approximate (π ≈ 3.14):
          <span class="inline-block font-mono bg-white px-2 py-1 mx-1 rounded text-base">31.4&nbsp;cm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useGeometryCircleAnimation } from '~/composables/useGeometryAnimation';
import { useAnimationStore } from '~/stores/animationStore';

const props = defineProps<{
  currentStep: number;
}>();

// Step Labels/Descriptions for overlay
const stepLabels = [
  `The circumference for a circle with radius <strong>r</strong> is: <span class="font-mono text-blue-800">C = 2πr</span>`,
  `Substitute <span class="font-mono text-blue-800">r = 5&nbsp;cm</span>: <br> <span class="font-mono">C = 2π × 5</span>`,
  `Multiply the numbers: <span class="font-mono">C = 10π cm</span>`,
  `Now, approximate π ≈ 3.14:<br> <span class="font-mono">C ≈ 10 × 3.14 = 31.4&nbsp;cm</span>`,
];
const showLabels = computed(() => props.currentStep >= 0 && props.currentStep < stepLabels.length);
const activeStepLabel = computed(() =>
  props.currentStep >= 0 && props.currentStep < stepLabels.length
    ? stepLabels[props.currentStep]
    : ''
);

// Set up the Three.js animation (composable)
const canvasHolderRef = ref<HTMLElement | null>(null);
const { setupScene, goToStep, cleanup } = useGeometryCircleAnimation();

onMounted(() => {
  if (canvasHolderRef.value) {
    setupScene(canvasHolderRef.value);
    goToStep(props.currentStep);
  }
});

watch(
  () => props.currentStep,
  (step) => {
    goToStep(step);
  }
);

onBeforeUnmount(() => {
  cleanup();
});
</script>
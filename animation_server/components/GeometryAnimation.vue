<template>
  <div class="flex flex-col md:flex-row w-full h-full min-h-screen bg-gray-50">
    <!-- Solution Steps (Left Panel) -->
    <geometry-steps-list
      class="md:w-1/3 w-full md:max-w-xs border-r border-gray-200 bg-white"
      :steps="steps"
      :current-step="currentStep"
      @step-click="handleStepClick"
    />
    <!-- Animation + Controls (Right Panel) -->
    <div class="relative flex-1 min-h-[320px] flex flex-col">
      <geometry-animation-canvas
        class="flex-1 min-h-[300px]"
        :current-step="currentStep"
      />
      <div class="flex justify-between items-center px-6 py-4 bg-white border-t border-gray-200">
        <geometry-animation-controls
          :current-step="currentStep"
          :total-steps="steps.length"
          @next="goToNext"
          @prev="goToPrev"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAnimationStore } from '~/stores/animationStore';
import GeometryStepsList from './geometry/StepsList.vue';
import GeometryAnimationCanvas from './geometry/AnimationCanvas.vue';
import GeometryAnimationControls from './geometry/AnimationControls.vue';

// Define solution steps
const steps = [
  {
    id: 1,
    short: 'Recall Formula',
    desc: 'The circumference formula for a circle with radius r is:  C = 2πr.',
  },
  {
    id: 2,
    short: 'Substitute Radius',
    desc: 'Substitute the given radius r = 5 cm into the formula:  C = 2π × 5.',
  },
  {
    id: 3,
    short: 'Simplify',
    desc: 'Multiply the numbers to get:  C = 10π cm.',
  },
  {
    id: 4,
    short: 'Approximate',
    desc: 'Use π ≈ 3.14 to get C ≈ 31.4 cm.',
  },
];

const animationStore = useAnimationStore();
const { currentStep } = storeToRefs(animationStore);

// Called when user selects a step in the list
function handleStepClick(idx: number) {
  animationStore.setStep(idx);
}

// Navigation Functions
function goToNext() {
  if (currentStep.value < steps.length - 1) {
    animationStore.setStep(currentStep.value + 1);
  }
}
function goToPrev() {
  if (currentStep.value > 0) {
    animationStore.setStep(currentStep.value - 1);
  }
}
</script>
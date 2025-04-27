import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Pinia store to keep track of current animation step
 * Since no steps provided for the problem, store is minimal
 */
export const useAnimationStore = defineStore('animationStore', () => {
  const step = ref(0);

  // As no steps, max steps is zero
  const maxStep = 0;

  function setStep(n: number) {
    if (n >= 0 && n <= maxStep) {
      step.value = n;
    }
  }

  function nextStep() {
    if (step.value < maxStep) step.value++;
  }

  function previousStep() {
    if (step.value > 0) step.value--;
  }

  return { step, maxStep, setStep, nextStep, previousStep };
});

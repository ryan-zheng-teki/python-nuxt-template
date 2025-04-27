import { defineStore } from 'pinia';

export const useAnimationStore = defineStore('animationStore', {
  state: () => ({
    currentStep: 0,
  }),
  actions: {
    setStep(idx: number) {
      this.currentStep = idx;
    },
  },
});
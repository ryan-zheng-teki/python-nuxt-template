import { defineStore } from 'pinia';
import { elements, availableElementSymbols, type ElementData } from '~/utils/elements';
import { ref, computed } from 'vue';

export type OrbitSpeed = 'slow' | 'normal' | 'fast';

interface AtomState {
  selectedElementSymbol: string;
  orbitSpeed: OrbitSpeed;
}

export const useAtomStore = defineStore('atom', () => {
  // State
  const selectedElementSymbol = ref<string>('H'); // Default to Hydrogen
  const orbitSpeed = ref<OrbitSpeed>('normal');

  // Getters
  const availableElements = computed(() => availableElementSymbols.map(symbol => ({
    symbol,
    name: elements[symbol].name,
    atomicNumber: elements[symbol].atomicNumber,
  })).sort((a, b) => a.atomicNumber - b.atomicNumber)); // Provide sorted list for dropdown

  const selectedElementData = computed<ElementData | undefined>(() => {
    return elements[selectedElementSymbol.value];
  });

  const speedMultiplier = computed(() => {
    switch (orbitSpeed.value) {
      case 'slow': return 0.5;
      case 'fast': return 2.0;
      case 'normal':
      default: return 1.0;
    }
  });

  // Actions
  function selectElement(symbol: string) {
    if (elements[symbol]) {
      selectedElementSymbol.value = symbol;
      console.log(`AtomStore: Selected element ${symbol}`);
    } else {
      console.warn(`AtomStore: Attempted to select unknown element symbol: ${symbol}`);
    }
  }

  function setOrbitSpeed(speed: OrbitSpeed) {
    orbitSpeed.value = speed;
    console.log(`AtomStore: Set orbit speed to ${speed}`);
  }

  return {
    // State
    selectedElementSymbol,
    orbitSpeed,
    // Getters
    availableElements,
    selectedElementData,
    speedMultiplier,
    // Actions
    selectElement,
    setOrbitSpeed,
  };
});

console.log('Pinia store "atom" defined.');


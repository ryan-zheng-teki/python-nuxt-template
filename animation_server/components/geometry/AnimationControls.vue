<template>
  <div class="flex items-center gap-4 w-full justify-between">
    <button
      @click="$emit('prev')"
      :disabled="currentStep === 0"
      class="flex items-center py-2 px-4 rounded transition bg-gray-200 text-gray-700 font-semibold border-gray-300 border hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <fa :icon="['fas', 'arrow-left']" class="mr-2" /> Previous
    </button>
    <button
      @click="$emit('next')"
      :disabled="currentStep === totalSteps - 1"
      class="flex items-center py-2 px-4 rounded transition bg-blue-600 text-white font-semibold border-blue-700 border hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next <fa :icon="['fas', 'arrow-right']" class="ml-2" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

defineProps<{
  currentStep: number;
  totalSteps: number;
}>();
defineEmits<{
  (e: 'next'): void;
  (e: 'prev'): void;
}>();
</script>
<template>
  <nav aria-label="Solution Steps" class="h-full py-6 px-4 flex flex-col">
    <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
      <fa :icon="['fas', 'list-ol']" class="text-blue-500"/>
      Solution Steps
    </h2>
    <ol class="space-y-3 overflow-auto flex-1">
      <li
        v-for="(step, idx) in steps"
        :key="step.id"
        @click="() => selectStep(idx)"
        class="cursor-pointer rounded-lg p-4 border transition-all"
        :class="[
          idx === currentStep
            ? 'bg-blue-50 border-blue-400 shadow text-blue-900 font-semibold ring-2 ring-blue-300'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-100 hover:border-blue-300',
        ]"
      >
        <div class="flex items-center mb-2">
          <span
            class="flex items-center justify-center w-7 h-7 rounded-full mr-3 text-white font-black"
            :class="idx === currentStep ? 'bg-blue-500' : 'bg-gray-400'"
          >
            {{ idx + 1 }}
          </span>
          <span class="text-base font-medium">{{ step.short }}</span>
        </div>
        <div class="text-sm text-gray-600">
          {{ step.desc }}
        </div>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
defineProps<{
  steps: { id: number; short: string; desc: string }[];
  currentStep: number;
}>();
const emit = defineEmits<{
  (e: 'step-click', idx: number): void;
}>();
function selectStep(idx: number) {
  emit('step-click', idx);
}
</script>
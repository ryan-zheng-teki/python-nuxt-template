<template>
  <div>
    <!-- Streaming analysis display -->
    <div v-if="streaming" class="p-5 bg-slate-50 rounded-lg shadow-md mb-6 border-t-4 border-indigo-500">
      <h2 class="text-lg font-medium text-indigo-900 mb-3">Analysis (streaming)...</h2>
      <div class="bg-slate-100 p-3 rounded">
        <MarkdownRenderer :content="analysis" />
      </div>
    </div>

    <!-- Solution display -->
    <div v-if="solution" class="bg-slate-50 rounded-lg shadow-md overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Solution</h2>
          <button
            @click="$emit('reset')"
            class="px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors shadow-sm border border-indigo-400"
          >
            Solve Another Problem
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <div
          v-for="(step, index) in solution"
          :key="index"
          class="p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg hover:shadow-md transition-shadow"
        >
          <h3 class="font-medium text-lg mb-2 text-indigo-900">Step {{ index + 1 }}</h3>
          
          <!-- Render description with markdown -->
          <div v-if="step.description" class="mb-2 text-slate-700">
            <MarkdownRenderer :content="step.description" />
          </div>
          
          <!-- Render reasoning with markdown -->
          <div v-if="step.reasoning" class="mb-2 pl-3 border-l-2 border-indigo-300">
            <h4 class="text-sm font-medium text-indigo-700">Reasoning:</h4>
            <div class="text-slate-700">
              <MarkdownRenderer :content="step.reasoning" />
            </div>
          </div>
          
          <!-- Render calculation with markdown -->
          <div v-if="step.calculation" class="pl-3 border-l-2 border-indigo-300">
            <h4 class="text-sm font-medium text-indigo-700">Calculation:</h4>
            <div class="text-slate-700 bg-slate-100 p-2 rounded border border-slate-200">
              <MarkdownRenderer :content="step.calculation" />
            </div>
          </div>
        </div>

        <div v-if="solution.length && solution[solution.length - 1].final_answer" class="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg shadow-sm">
          <h3 class="font-medium text-lg mb-2 text-indigo-900">Final Answer</h3>
          <div class="text-indigo-900 font-semibold text-lg">
            <MarkdownRenderer :content="solution[solution.length - 1].final_answer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MarkdownRenderer from '~/components/common/MarkdownRenderer.vue';

defineProps({
  streaming: {
    type: Boolean,
    required: true
  },
  analysis: {
    type: String,
    default: ''
  },
  solution: {
    type: Array,
    default: () => []
  }
});

defineEmits(['reset']);
</script>

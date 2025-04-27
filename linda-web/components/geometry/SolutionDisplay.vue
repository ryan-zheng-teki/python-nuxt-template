<template>
  <div>
    <!-- Streaming analysis display -->
    <div v-if="streaming" class="p-5 bg-white rounded-lg shadow-md mb-6 border-t-4 border-indigo-500">
      <h2 class="text-lg font-medium text-indigo-900 mb-3">Analysis (streaming)...</h2>
      <pre class="whitespace-pre-wrap text-slate-700 bg-slate-50 p-3 rounded">{{ analysis }}</pre>
    </div>

    <!-- Solution display -->
    <div v-if="solution" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Solution</h2>
          <button
            @click="$emit('reset')"
            class="px-3 py-1.5 bg-white text-indigo-700 rounded hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Solve Another Problem
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <div
          v-for="(step, index) in solution"
          :key="index"
          class="p-4 border-l-4 border-indigo-400 bg-gradient-to-r from-slate-50 to-white rounded-r-lg hover:shadow-md transition-shadow"
        >
          <h3 class="font-medium text-lg mb-2 text-indigo-900">Step {{ index + 1 }}</h3>
          <p class="mb-2 text-slate-700">{{ step.description }}</p>
          <div v-if="step.reasoning" class="mb-2 pl-3 border-l-2 border-indigo-300">
            <h4 class="text-sm font-medium text-indigo-700">Reasoning:</h4>
            <p class="text-slate-700">{{ step.reasoning }}</p>
          </div>
          <div v-if="step.calculation" class="pl-3 border-l-2 border-indigo-300">
            <h4 class="text-sm font-medium text-indigo-700">Calculation:</h4>
            <p class="text-slate-700 font-mono bg-white p-2 rounded border border-slate-200">{{ step.calculation }}</p>
          </div>
        </div>

        <div v-if="solution.length && solution[solution.length - 1].final_answer" class="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg shadow-sm">
          <h3 class="font-medium text-lg mb-2 text-indigo-900">Final Answer</h3>
          <p class="text-indigo-900 font-semibold text-lg">{{ solution[solution.length - 1].final_answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
})

defineEmits(['reset'])
</script>

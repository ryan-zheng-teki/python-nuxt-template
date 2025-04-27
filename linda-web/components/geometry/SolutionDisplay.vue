<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h2 class="text-xl font-semibold">Solution</h2>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-if="solution && solution.length > 0 && !showAnimation"
            @click="generateAnimation"
            :disabled="isGeneratingAnimation"
            class="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm border border-blue-400 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isGeneratingAnimation" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ isGeneratingAnimation ? 'Generating...' : 'Show Animation' }}
          </button>
          <button
            v-if="showAnimation"
            @click="showAnimation = false"
            class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors shadow-sm border border-indigo-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Solution
          </button>
          <button
            @click="$emit('reset')"
            class="px-3 py-1.5 bg-white text-indigo-700 rounded-md hover:bg-indigo-50 transition-colors shadow-sm border border-indigo-400 flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Solve Another Problem
          </button>
        </div>
      </div>
    </div>

    <!-- Animation content (shown when animation is requested) -->
    <div v-if="showAnimation" class="px-6 py-5">
      <AnimationViewer
        :is-loading="animationStore.isLoading"
        :error="animationStore.error"
        :animation-ready="animationStore.animationReady"
        :animation-url="animationStore.getAnimationUrl()"
        @retry="generateAnimation"
      />
    </div>

    <!-- Streaming analysis display -->
    <div v-else-if="streaming" class="p-5 border-b border-indigo-100">
      <div class="flex items-center text-indigo-800 mb-3">
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 class="font-medium text-lg">Analyzing problem...</h3>
      </div>
      <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <MarkdownRenderer :content="analysis" />
      </div>
    </div>

    <!-- Solution content -->
    <div v-else-if="solution && solution.length > 0" class="px-6 py-5">
      <!-- Main solution content -->
      <div class="prose prose-indigo max-w-none">
        <MarkdownRenderer :content="solution[0].description" />
      </div>

      <!-- Final answer -->
      <div v-if="solution[0].final_answer" class="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <h3 class="font-medium text-lg text-indigo-800 mb-2 flex items-center">
          <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Final Answer
        </h3>
        <div class="text-indigo-900 font-medium text-lg">
          <MarkdownRenderer :content="solution[0].final_answer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAnimationDeveloperStore } from '~/stores/animationDeveloperStore';
import MarkdownRenderer from '~/components/common/MarkdownRenderer.vue';
import AnimationViewer from '~/components/geometry/AnimationViewer.vue';

const props = defineProps({
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
  },
  problemText: {
    type: String,
    default: ''
  }
});

defineEmits(['reset']);

// Animation state
const showAnimation = ref(false);
const isGeneratingAnimation = ref(false);
const animationStore = useAnimationDeveloperStore();

// Generate animation when the button is clicked
async function generateAnimation() {
  try {
    showAnimation.value = true;
    isGeneratingAnimation.value = true;
    
    // Terminate any existing animation agent first
    await animationStore.terminateAgent();
    
    // Initialize animation agent
    await animationStore.startAgent();
    
    // Generate the animation based on the problem and solution
    await animationStore.generateAnimation(props.problemText, props.solution);
    
  } catch (error) {
    console.error('Failed to generate animation:', error);
  } finally {
    isGeneratingAnimation.value = false;
  }
}
</script>

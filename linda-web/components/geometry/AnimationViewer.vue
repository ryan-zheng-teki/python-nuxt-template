<template>
  <div class="animation-container">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
      <p class="text-indigo-600 font-semibold text-center">Generating animation...</p>
      <p class="text-sm text-gray-500 text-center mt-2">
        This may take a few moments while we create a visual representation of the solution.
      </p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700" v-html="formattedError"></p>
          <div class="mt-3">
            <button 
              @click="$emit('retry')" 
              class="mr-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md focus:outline-none"
            >
              Try again
            </button>
            <button
              v-if="isServerError"
              @click="openAnimationServer"
              class="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none"
            >
              Open Animation Server
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Animation iframe -->
    <div v-else-if="animationReady" class="animation-iframe-container">
      <iframe 
        :src="animationUrl" 
        class="animation-iframe"
        frameborder="0" 
        allowfullscreen
        @load="iframeLoaded"
        @error="iframeError"
        ref="animationIframe"
      ></iframe>
    </div>

    <!-- Initial state -->
    <div v-else class="flex flex-col items-center justify-center p-8 text-center">
      <svg class="h-12 w-12 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="font-semibold text-indigo-600">Click "Generate Animation" to visualize the solution</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  animationReady: {
    type: Boolean,
    default: false
  },
  animationUrl: {
    type: String,
    default: ''
  }
});

const animationIframe = ref(null);
const iframeLoadError = ref(false);

// Format error message to include HTML links when needed
const formattedError = computed(() => {
  if (!props.error) return '';
  
  // If the error mentions the animation server not being accessible
  if (props.error.includes('Animation server not accessible')) {
    return props.error + ' <br><span class="text-xs mt-1 inline-block">You can try starting it manually with "cd python-nuxt-template/animation_server && yarn dev"</span>';
  }
  
  return props.error;
});

// Determine if this is a server error
const isServerError = computed(() => {
  return props.error && (
    props.error.includes('server') || 
    props.error.includes('Server') || 
    props.error.includes('404')
  );
});

// Handle iframe loaded event
function iframeLoaded() {
  console.log('Animation iframe loaded successfully');
  iframeLoadError.value = false;
}

// Handle iframe error
function iframeError(event) {
  console.error('Error loading animation iframe:', event);
  iframeLoadError.value = true;
}

// Open animation server in a new tab
function openAnimationServer() {
  window.open(props.animationUrl, '_blank');
}

defineEmits(['retry']);
</script>

<style scoped>
.animation-container {
  width: 100%;
  min-height: 400px;
  background-color: #f8fafc;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.animation-iframe-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
}

.animation-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-indigo-900 inline-block mr-2">Restack Geometry Solver</h1>
      <p class="text-sm text-slate-600 inline-block">An AI-powered platform for geometry learning</p>
    </div>

    <!-- Connection Status -->
    <div v-if="connectionStatus" class="mb-4 p-3 bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 text-sm rounded shadow-sm">
      <p>{{ connectionStatus }}</p>
    </div>

    <!-- Input Form (now full width) -->
    <div class="bg-slate-50 rounded-lg shadow-md p-5 border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
      <h2 class="text-lg font-medium text-indigo-900 mb-4">Enter Your Geometry Problem</h2>
      
      <!-- Input type tabs -->
      <div class="flex border-b border-slate-200 mb-4">
        <button 
          @click="activeTab = 'text'"
          :class="[
            'py-2 px-4 font-medium text-sm mr-2',
            activeTab === 'text' 
              ? 'text-indigo-700 border-b-2 border-indigo-500 font-medium' 
              : 'text-slate-500 hover:text-indigo-600'
          ]"
        >
          Text Description
        </button>
        <button 
          @click="activeTab = 'image'"
          :class="[
            'py-2 px-4 font-medium text-sm',
            activeTab === 'image' 
              ? 'text-indigo-700 border-b-2 border-indigo-500 font-medium' 
              : 'text-slate-500 hover:text-indigo-600'
          ]"
        >
          Upload Image
        </button>
      </div>
      
      <!-- Text input tab -->
      <div v-if="activeTab === 'text'" class="mb-4">
        <textarea
          id="problem-text"
          v-model="problemText"
          class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-100"
          rows="4"
          placeholder="Describe your geometry problem here. For example: Find the area of a triangle with base 6 cm and height 8 cm."
        ></textarea>
      </div>
      
      <!-- Image upload tab -->
      <div v-if="activeTab === 'image'" class="mb-4">
        <div class="flex items-center justify-center w-full">
          <label
            class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-100 hover:bg-indigo-50 transition-colors"
          >
            <div class="flex flex-col items-center justify-center py-3">
              <svg class="w-8 h-8 mb-2 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="text-sm text-indigo-600 font-medium">Upload or drag image</p>
              <p class="text-xs text-slate-500">PNG, JPG (max 2MB)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              accept="image/png, image/jpeg, image/jpg"
              @change="handleImageUpload"
            />
          </label>
        </div>
      </div>
      
      <!-- Image preview (shown with either tab) -->
      <div v-if="imageBase64" class="mt-2 mb-4">
        <div class="flex items-start">
          <img :src="imageBase64" alt="Problem diagram" class="max-w-full h-auto max-h-40 rounded border border-slate-200" />
          <button
            @click="clearImage"
            class="ml-2 p-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div class="flex items-center">
        <button
          @click="solveProblem"
          :disabled="!isFormValid"
          class="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-md shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Solve Problem
        </button>
      </div>
      <p class="text-xs text-slate-500 text-center mt-2">
        {{ activeTab === 'text' ? 'Enter text description or switch to image upload' : 'Upload an image or switch to text input' }}
      </p>
    </div>

    <!-- Solution Display -->
    <div v-if="solver.solution || solver.streaming" class="mt-6">
      <SolutionDisplay
        :streaming="solver.streaming"
        :analysis="solver.analysis"
        :solution="solver.solution"
        @reset="resetSolver"
      />
    </div>

    <!-- Examples Section -->
    <div v-if="!solver.solution && !solver.streaming" class="mt-6">
      <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
        <h3 class="text-sm font-medium text-indigo-800 mb-3">Try These Examples:</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="loadExample('Find the area of a triangle with base 8 cm and height 6 cm.')"
            class="px-3 py-2 bg-slate-100 rounded border border-slate-200 text-slate-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
          >
            Triangle Area
          </button>
          <button 
            @click="loadExample('Calculate the circumference of a circle with radius 5 cm.')"
            class="px-3 py-2 bg-slate-100 rounded border border-slate-200 text-slate-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
          >
            Circle Circumference
          </button>
          <button 
            @click="loadExample('What is the perimeter of a rectangle with length 10 cm and width 4 cm?')"
            class="px-3 py-2 bg-slate-100 rounded border border-slate-200 text-slate-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
          >
            Rectangle Perimeter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGeometrySolverStore } from '~/stores/geometrySolver'
import SolutionDisplay from '~/components/geometry/SolutionDisplay.vue'

// Local component state
const problemText = ref('')
const imageBase64 = ref('')
const isLoading = ref(false)
const error = ref('')
const connectionStatus = ref('')
const activeTab = ref('text')

// Pinia store
const solver = useGeometrySolverStore()

// Computed values
const isFormValid = computed(() => {
  return problemText.value.trim() !== '' || imageBase64.value !== ''
})

// Load an example problem
function loadExample(example) {
  problemText.value = example
  activeTab.value = 'text' // Switch to text tab
}

// Handle file upload
function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be less than 2MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imageBase64.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Clear image selection
function clearImage() {
  imageBase64.value = ''
  const input = document.getElementById('dropzone-file')
  if (input) input.value = ''
}

function clearError() {
  error.value = ''
}

// Lifecycle: start agent when page loads
onMounted(async () => {
  try {
    isLoading.value = true
    connectionStatus.value = 'Connecting to agent...'
    await solver.startAgent()
    connectionStatus.value = 'Agent connected successfully!'
    setTimeout(() => {
      connectionStatus.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to initialize solver:', err)
    error.value = 'Unable to connect to the solver. Please check your connection and try again.'
    connectionStatus.value = ''
  } finally {
    isLoading.value = false
  }
})

// Trigger streaming solve
async function solveProblem() {
  if (!isFormValid.value) return
  
  try {
    isLoading.value = true
    error.value = ''
    await solver.streamProblem(problemText.value)
  } catch (err) {
    console.error('Error during streaming:', err)
    error.value = 'Error while solving the problem. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Reset for a new problem
function resetSolver() {
  problemText.value = ''
  imageBase64.value = ''
  error.value = ''
  solver.reset()
}
</script>

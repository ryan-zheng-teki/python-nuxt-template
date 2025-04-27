<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-grow py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Connection Status -->
        <div 
          v-if="connectionStatus" 
          class="mb-6 p-3 rounded-lg shadow-sm flex items-center"
          :class="{
            'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700': !isError,
            'bg-red-50 border-l-4 border-red-500 text-red-700': isError
          }"
        >
          <svg v-if="!isError" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p>{{ connectionStatus }}</p>
        </div>

        <!-- Input Form -->
        <div class="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div class="bg-gradient-to-b from-indigo-50 to-white px-6 pt-6 pb-4">
            <h2 class="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Enter Your Geometry Problem
            </h2>
            
            <!-- Input type tabs -->
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-6">
                <button 
                  @click="activeTab = 'text'"
                  :class="[
                    'pb-3 font-medium text-sm transition-colors',
                    activeTab === 'text' 
                      ? 'text-indigo-600 border-b-2 border-indigo-500' 
                      : 'text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:border-b-2'
                  ]"
                >
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Text Description
                  </div>
                </button>
                <button 
                  @click="activeTab = 'image'"
                  :class="[
                    'pb-3 font-medium text-sm transition-colors',
                    activeTab === 'image' 
                      ? 'text-indigo-600 border-b-2 border-indigo-500' 
                      : 'text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:border-b-2'
                  ]"
                >
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Upload Image
                  </div>
                </button>
              </nav>
            </div>
          </div>

          <div class="p-6 pt-4">
            <!-- Text input tab -->
            <div v-if="activeTab === 'text'" class="mb-4">
              <textarea
                id="problem-text"
                v-model="problemText"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                rows="4"
                placeholder="Describe your geometry problem here. For example: Find the area of a triangle with base 6 cm and height 8 cm."
              ></textarea>
            </div>
            
            <!-- Image upload tab -->
            <div v-if="activeTab === 'image'" class="mb-4">
              <div class="flex items-center justify-center w-full">
                <label
                  class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div class="flex flex-col items-center justify-center py-3">
                    <svg class="w-10 h-10 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="text-sm text-indigo-600 font-medium">Upload or drag image</p>
                    <p class="text-xs text-indigo-500 mt-1">PNG, JPG (max 2MB)</p>
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
            <div v-if="imageBase64" class="mb-4">
              <div class="flex items-start">
                <img :src="imageBase64" alt="Problem diagram" class="max-w-full h-auto max-h-48 rounded-lg border border-indigo-200" />
                <button
                  @click="clearImage"
                  class="ml-2 p-1.5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Action buttons -->
            <div class="flex flex-col sm:flex-row items-center">
              <button
                @click="solveProblem"
                :disabled="!isFormValid || isLoading"
                class="w-full sm:flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h.01M9 16h.01"></path>
                </svg>
                {{ isLoading ? 'Solving...' : 'Solve Problem' }}
              </button>
              <p class="text-xs text-gray-500 mt-2 sm:mt-0 sm:ml-4 text-center sm:text-left">
                {{ activeTab === 'text' ? 'Enter text description or switch to image upload' : 'Upload an image or switch to text input' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Solution Display -->
        <div v-if="solver.solution || solver.streaming">
          <SolutionDisplay
            :streaming="solver.streaming"
            :analysis="solver.analysis"
            :solution="solver.solution"
            :problem-text="problemText"
            @reset="resetSolver"
          />
        </div>

        <!-- Examples and Features Sections -->
        <div v-if="!solver.solution && !solver.streaming" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <!-- Examples Section -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="bg-indigo-600 px-4 py-3">
              <h3 class="text-sm font-medium text-white flex items-center">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Try These Examples
              </h3>
            </div>
            <div class="p-4">
              <div class="space-y-2">
                <button 
                  @click="loadExample('Find the area of a triangle with base 8 cm and height 6 cm.')"
                  class="w-full px-3 py-2 text-left bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Triangle Area
                </button>
                <button 
                  @click="loadExample('Calculate the circumference of a circle with radius 5 cm.')"
                  class="w-full px-3 py-2 text-left bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Circle Circumference
                </button>
                <button 
                  @click="loadExample('What is the perimeter of a rectangle with length 10 cm and width 4 cm?')"
                  class="w-full px-3 py-2 text-left bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Rectangle Perimeter
                </button>
              </div>
            </div>
          </div>

          <!-- Features Section -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="bg-indigo-600 px-4 py-3">
              <h3 class="text-sm font-medium text-white flex items-center">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Key Features
              </h3>
            </div>
            <div class="p-4">
              <div class="space-y-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900">Step-by-Step Solutions</h4>
                    <p class="mt-1 text-xs text-gray-500">Our AI breaks down every geometry problem into clear, understandable steps.</p>
                  </div>
                </div>
                <div class="flex">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900">Image Recognition</h4>
                    <p class="mt-1 text-xs text-gray-500">Upload a photo of your geometry problem, and our AI will interpret and solve it.</p>
                  </div>
                </div>
                <div class="flex">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900">Interactive Animations</h4>
                    <p class="mt-1 text-xs text-gray-500">Visualize solutions with dynamic step-by-step animations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useGeometrySolverStore } from '~/stores/geometrySolver'
import { useAnimationDeveloperStore } from '~/stores/animationDeveloperStore'
import SolutionDisplay from '~/components/geometry/SolutionDisplay.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

// Local component state
const problemText = ref('')
const imageBase64 = ref('')
const isLoading = ref(false)
const error = ref('')
const connectionStatus = ref('')
const isError = ref(false)
const activeTab = ref('text')

// Pinia stores
const solver = useGeometrySolverStore()
const animationStore = useAnimationDeveloperStore()

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

// Solve the problem - now with agent termination before starting new problem
async function solveProblem() {
  if (!isFormValid.value) return
  
  try {
    isLoading.value = true
    error.value = ''
    connectionStatus.value = ''
    
    // Terminate any existing agents first before starting a new problem
    await solver.terminateAgent()
    await animationStore.terminateAgent()
    
    // Now stream the problem with a fresh agent
    await solver.streamProblem(problemText.value)
  } catch (err) {
    console.error('Error during streaming:', err)
    error.value = 'Error while solving the problem. Please try again.'
    connectionStatus.value = 'Error: Could not solve the problem. Please try again.'
    isError.value = true
    
    // If we get an agent initialization error, try to perform a full reset
    if (err.message.includes('agent')) {
      await solver.fullReset()
      await animationStore.fullReset()
    }
  } finally {
    isLoading.value = false
  }
}

// Reset for a new problem with proper agent termination
async function resetSolver() {
  problemText.value = ''
  imageBase64.value = ''
  error.value = ''
  connectionStatus.value = ''
  isError.value = false
  
  // Reset both stores and properly terminate agents
  await solver.fullReset()
  await animationStore.fullReset()
}

// Clean up when component is unmounted - terminate any active agents
onBeforeUnmount(async () => {
  // Make sure we clean up any running agents when leaving the page
  await solver.terminateAgent()
  await animationStore.terminateAgent()
})
</script>

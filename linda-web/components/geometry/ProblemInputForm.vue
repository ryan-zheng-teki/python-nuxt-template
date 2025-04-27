<template>
  <div class="bg-white rounded-lg shadow-lg p-4 mb-4 border-l-4 border-indigo-500">
    <h2 class="text-lg font-medium text-indigo-700 mb-3">Enter Your Geometry Problem</h2>

    <!-- Input type tabs -->
    <div class="flex border-b border-gray-200 mb-3">
      <button 
        @click="activeTab = 'text'"
        :class="[
          'py-2 px-4 font-medium text-sm mr-2',
          activeTab === 'text' 
            ? 'text-indigo-600 border-b-2 border-indigo-500' 
            : 'text-gray-500 hover:text-indigo-500'
        ]"
      >
        Text Description
      </button>
      <button 
        @click="activeTab = 'image'"
        :class="[
          'py-2 px-4 font-medium text-sm',
          activeTab === 'image' 
            ? 'text-indigo-600 border-b-2 border-indigo-500' 
            : 'text-gray-500 hover:text-indigo-500'
        ]"
      >
        Upload Image
      </button>
    </div>

    <!-- Text input tab -->
    <div v-if="activeTab === 'text'" class="mb-3">
      <textarea
        id="problem-text"
        v-model="localProblemText"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        rows="3"
        placeholder="Describe your geometry problem here. For example: Find the area of a triangle with base 6 cm and height 8 cm."
      ></textarea>
    </div>

    <!-- Image upload tab -->
    <div v-if="activeTab === 'image'" class="mb-3">
      <div class="flex items-center justify-center w-full">
        <label
          class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-white hover:bg-indigo-50 transition-colors"
        >
          <div class="flex flex-col items-center justify-center py-3">
            <svg class="w-8 h-8 mb-2 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="text-sm text-indigo-600 font-medium">Upload or drag image</p>
            <p class="text-xs text-indigo-500">PNG, JPG (max 2MB)</p>
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
    <div v-if="imagePreview" class="mt-2 mb-3">
      <div class="flex items-start">
        <img :src="imagePreview" alt="Problem diagram" class="max-w-full h-auto max-h-40 rounded border border-indigo-200" />
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
        @click="submit"
        :disabled="!isFormValid"
        class="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-md shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        Solve Problem
      </button>
      <div class="flex-1 text-xs text-gray-500 ml-2">
        {{ activeTab === 'text' ? 'Enter text description or switch to image upload' : 'Upload an image or switch to text input' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  problemText: {
    type: String,
    default: ''
  },
  imageBase64: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:problemText', 'update:imageBase64', 'submit', 'clear-error'])

// Local state
const localProblemText = ref(props.problemText)
const imagePreview = ref(props.imageBase64)
const activeTab = ref('text') // Default to text tab

// Watch for prop changes
watch(() => props.problemText, (newValue) => {
  localProblemText.value = newValue
})

watch(() => props.imageBase64, (newValue) => {
  imagePreview.value = newValue
})

// Watch for local changes to emit updates
watch(localProblemText, (newValue) => {
  emit('update:problemText', newValue)
})

// Validation
const isFormValid = computed(() => {
  return localProblemText.value.trim() !== '' || imagePreview.value !== ''
})

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
    const result = e.target.result
    imagePreview.value = result
    emit('update:imageBase64', result)
  }
  reader.readAsDataURL(file)
}

// Clear image selection
function clearImage() {
  imagePreview.value = ''
  emit('update:imageBase64', '')
  const input = document.getElementById('dropzone-file')
  if (input) input.value = ''
}

// Submit the form
function submit() {
  if (!isFormValid.value) return
  emit('clear-error')
  emit('submit')
}
</script>

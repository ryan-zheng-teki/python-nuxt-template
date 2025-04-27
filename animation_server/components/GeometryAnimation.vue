<template>
  <div class="w-full h-full flex flex-col">
    <!-- Canvas holder -->
    <div ref="canvasContainer" class="flex-grow bg-gray-100 rounded-lg shadow-md relative">
      <!-- Overlay: Labels and controls -->
      <div class="absolute top-2 left-2 z-10 flex space-x-2">
        <button
          @click="previousStep"
          :disabled="stepIndex === 0"
          class="px-3 py-1 rounded bg-blue-600 text-white disabled:bg-blue-300"
          aria-label="Previous Step"
        >
          Previous
        </button>
        <button
          @click="nextStep"
          :disabled="stepIndex === maxStep"
          class="px-3 py-1 rounded bg-blue-600 text-white disabled:bg-blue-300"
          aria-label="Next Step"
        >
          Next
        </button>
      </div>
      <div class="absolute bottom-2 left-2 text-gray-700 bg-white bg-opacity-75 rounded px-2 py-1 select-none">
        Step {{ stepIndex + 1 }} of {{ maxStep + 1 }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Import Vue and reactivity/composition tools
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

// Since problem has no steps or content, animation will just show "No Steps" label on canvas

const canvasContainer = ref<HTMLDivElement>();

// Step management
const stepIndex = ref(0);
const maxStep = 0; // zero step only (no steps provided)

// Animation & threejs related variables
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationFrameId: number;

let labelSprite: THREE.Sprite | null = null;

function createTextSprite(message: string, parameters?: any): THREE.Sprite {
  // function to create a sprite with text label
  if (parameters === undefined) parameters = {};
  const fontface = parameters.hasOwnProperty('fontface') 
      ? parameters['fontface'] : 'Arial';
  const fontsize = parameters.hasOwnProperty('fontsize') 
      ? parameters['fontsize'] : 24;
  const borderThickness = parameters.hasOwnProperty('borderThickness') 
      ? parameters['borderThickness'] : 4;
  const borderColor = parameters.hasOwnProperty('borderColor') 
      ? parameters['borderColor'] : { r:0, g:0, b:0, a:1.0 };
  const backgroundColor = parameters.hasOwnProperty('backgroundColor') 
      ? parameters['backgroundColor'] : { r:255, g:255, b:255, a:1.0 };
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  context.font = fontsize + "px " + fontface;
  
  // get size data (height depends only on font size)
  const metrics = context.measureText(message);
  const textWidth = metrics.width;
  
  // background color
  context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
  // border color
  context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;

  context.lineWidth = borderThickness;
  // draw background rectangle with border
  context.fillRect(borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness);
  context.strokeRect(borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness);

  // text color
  context.fillStyle = "rgba(0, 0, 0, 1.0)";
  context.fillText(message, borderThickness, fontsize + borderThickness);

  // canvas contents will be used for a texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(5 * (textWidth / fontsize), 5, 1.0);
  return sprite;
}

function initThree() {
  // Create scene
  scene = new THREE.Scene();

  // Camera
  const width = canvasContainer.value?.clientWidth ?? window.innerWidth;
  const height = canvasContainer.value?.clientHeight ?? window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 10);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xf0f0f0, 1);

  // Append renderer canvas
  if (canvasContainer.value) {
    canvasContainer.value.innerHTML = ''; // clear if any
    canvasContainer.value.appendChild(renderer.domElement);
  }

  // Add simple ambient light
  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  // Add label sprite "No Steps Available" centered
  labelSprite = createTextSprite('No Steps Available', {
    fontsize: 48,
    borderThickness: 6,
    borderColor: { r: 0, g: 0, b: 255, a: 1.0 },
    backgroundColor: { r: 255, g: 255, b: 255, a: 0.8 }
  });
  labelSprite.position.set(0, 0, 0);
  scene.add(labelSprite);

  // Start render loop
  animate();
}

function animate(time?: number) {
  animationFrameId = requestAnimationFrame(animate);
  // Update Tween animations
  TWEEN.update(time);
  renderer.render(scene, camera);
}

function onWindowResize() {
  if (!canvasContainer.value) return;
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// Navigation handlers
function nextStep() {
  if (stepIndex.value < maxStep) {
    stepIndex.value++;
  }
}

function previousStep() {
  if (stepIndex.value > 0) {
    stepIndex.value--;
  }
}

onMounted(() => {
  initThree();
  window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  cancelAnimationFrame(animationFrameId);
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
/* Ensure canvas fills container */
</style>

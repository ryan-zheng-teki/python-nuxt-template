import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ref, onMounted, onUnmounted, watch, type Ref, computed, nextTick } from 'vue';
import { type ElementData, getShellColor } from '~/utils/elements';
import * as TWEEN from '@tweenjs/tween.js';

// Constants
const NUCLEUS_RADIUS = 0.5;
const ELECTRON_RADIUS = 0.1;
const SHELL_RADIUS_BASE = 1.5;
const SHELL_RADIUS_INCREMENT = 1.0;
const ORBIT_TILT_ANGLE = Math.PI / 6; // Tilt electron orbits slightly

// Extended ElectronObject to carry animation state
interface ElectronObject extends THREE.Mesh {
  shellIndex: number;
  orbitRadius: number;
  baseSpeed: number; // Base speed factor
  angle: number;     // Current angle on orbit path
}

export function useThreeAtomVisualizer(
  containerRef: Ref<HTMLCanvasElement | null>,
  elementData: Ref<ElementData | undefined>,
  speedMultiplier: Ref<number>
) {
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let controls: OrbitControls | null = null;
  let animationFrameId: number | null = null;
  let atomGroup: THREE.Group | null = null;
  const clock = new THREE.Clock();
  const electronObjects = ref<ElectronObject[]>([]);

  // --- Initialization ---
  const initScene = () => {
    if (!containerRef.value) {
      console.error("initScene called but canvas container ref is null.");
      return;
    }
    console.log('Initializing Three.js scene...');

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight;
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      camera.position.z = 10;

      renderer = new THREE.WebGLRenderer({ canvas: containerRef.value, antialias: true });
      renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 2;
      controls.maxDistance = 50;
      controls.target.set(0, 0, 0);

      atomGroup = new THREE.Group();
      scene.add(atomGroup);

      if (elementData.value) {
        console.log("Initial element data present, creating model during init.");
        createAtomModel(elementData.value);
      } else {
        console.log("No initial element data, model will be created by watcher later.");
        adjustCamera(undefined);
      }

      window.addEventListener('resize', handleResize);
      startAnimationLoop();
      console.log('Three.js scene initialized successfully.');
    } catch (error) {
      console.error('Error initializing Three.js scene:', error);
      cleanup();
    }
  };

  // --- Camera Adjustment ---
  const adjustCamera = (data: ElementData | undefined) => {
    if (!camera || !controls) return;

    let targetDistance: number;
    if (data && data.shells.length > 0) {
      const maxRadius = SHELL_RADIUS_BASE + (data.shells.length - 1) * SHELL_RADIUS_INCREMENT;
      targetDistance = Math.max(5, maxRadius * 2.5);
      console.log(`Adjusting camera target distance for ${data.symbol} to: ${targetDistance.toFixed(2)}`);
    } else {
      targetDistance = 10;
      console.log(`Resetting camera target distance to default: ${targetDistance}`);
    }

    TWEEN.removeAll();

    new TWEEN.Tween(camera.position)
      .to({ z: targetDistance }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => controls?.update())
      .start();

    controls.maxDistance = targetDistance * 2;
    controls.minDistance = 1;
    controls.update();
  };

  // --- Model Creation ---
  const createAtomModel = (data: ElementData | undefined) => {
    if (!scene || !atomGroup || !camera || !controls) {
      console.warn("createAtomModel called before scene is fully initialized. Aborting.");
      return;
    }

    console.log('Clearing previous atom model...');
    while (atomGroup.children.length > 0) {
      const child = atomGroup.children[0];
      disposeHierarchy(child);
      atomGroup.remove(child);
    }
    electronObjects.value = [];
    console.log('Previous model cleared.');

    if (!data) {
      console.log('No element data provided. Atom model is now empty.');
      adjustCamera(undefined);
      return;
    }

    console.log(`Creating atom model for: ${data.symbol}`);

    // Create Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(NUCLEUS_RADIUS, 32, 32);
    const nucleusMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    atomGroup.add(nucleus);

    // Create Shells and Electrons
    let cumulativeElectrons = 0;
    data.shells.forEach((electronCount, shellIndex) => {
      const shellRadius = SHELL_RADIUS_BASE + shellIndex * SHELL_RADIUS_INCREMENT;
      const shellColor = getShellColor(shellIndex);

      const orbitPlane = new THREE.Object3D();
      orbitPlane.rotation.x = ORBIT_TILT_ANGLE * (shellIndex % 2 === 0 ? 1 : -1);
      orbitPlane.rotation.y = (Math.PI / 4) * shellIndex;
      atomGroup.add(orbitPlane);

      const orbitGeometry = new THREE.TorusGeometry(shellRadius, 0.02, 16, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: shellColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitPlane.add(orbitMesh);

      const electronGeometry = new THREE.SphereGeometry(ELECTRON_RADIUS, 16, 16);
      const electronMaterial = new THREE.MeshStandardMaterial({
        color: shellColor,
        roughness: 0.3,
        metalness: 0.2,
        emissive: shellColor,
        emissiveIntensity: 0.4
      });

      for (let i = 0; i < electronCount; i++) {
        const electron = new THREE.Mesh(electronGeometry.clone(), electronMaterial.clone()) as ElectronObject;
        const initialAngle = (Math.PI * 2 * i) / electronCount + (shellIndex * Math.PI / 4);

        electron.shellIndex = shellIndex;
        electron.orbitRadius = shellRadius;
        electron.baseSpeed = 0.5 + 0.5 / (shellIndex + 1);
        electron.angle = initialAngle;

        // Position electron on the torus (XY plane) immediately
        const initX = Math.cos(initialAngle) * shellRadius;
        const initY = Math.sin(initialAngle) * shellRadius;
        electron.position.set(initX, initY, 0);

        orbitPlane.add(electron);
        electronObjects.value.push(electron);
        cumulativeElectrons++;
      }
    });

    console.log(`Model created with ${data.shells.length} shells and ${cumulativeElectrons} electrons.`);
    adjustCamera(data);
  };

  // --- Animation Loop ---
  const startAnimationLoop = () => {
    if (animationFrameId !== null) {
      console.warn("Animation loop already running.");
      return;
    }

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!renderer || !scene || !camera || !controls || !atomGroup) {
        console.log("Animation loop stopping: Resources released.");
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
      }

      const deltaTime = clock.getDelta();
      TWEEN.update(time);

      // Animate Electrons along the same XY plane as the torus
      electronObjects.value.forEach(electron => {
        if (!electron || !electron.parent) return;

        const speed = electron.baseSpeed * speedMultiplier.value * deltaTime;
        electron.angle += speed;

        const x = Math.cos(electron.angle) * electron.orbitRadius;
        const y = Math.sin(electron.angle) * electron.orbitRadius;
        electron.position.set(x, y, 0);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate(performance.now());
    console.log('Animation loop started.');
  };

  // --- Cleanup and Helpers ---
  const disposeHierarchy = (node: THREE.Object3D) => {
    node.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(mat => {
            mat.dispose();
            Object.values(mat).forEach((value: any) => {
              if (value instanceof THREE.Texture) {
                value.dispose();
              }
            });
          });
        }
      }
    });
  };

  const cleanup = () => {
    console.log('Cleaning up Three.js resources...');
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      console.log(`Cancelled animation frame: ${animationFrameId}`);
      animationFrameId = null;
    }
    window.removeEventListener('resize', handleResize);
    TWEEN.removeAll();
    console.log('Removed all tweens.');
    controls?.dispose();
    console.log('Disposed OrbitControls.');
    controls = null;

    if (scene) {
      console.log('Disposing scene objects...');
      while (scene.children.length > 0) {
        const object = scene.children[0];
        disposeHierarchy(object);
        scene.remove(object);
      }
      console.log('Scene objects disposed and removed.');
      scene = null;
    }

    if (renderer) {
      renderer.dispose();
      try {
        const ctx = renderer.getContext();
        ctx.getExtension('WEBGL_lose_context')?.loseContext();
        console.log('Attempted to force WebGL context loss.');
      } catch (e) {
        console.warn('Could not force WebGL context loss:', e);
      }
      console.log('Disposed WebGLRenderer.');
      renderer = null;
    }

    camera = null;
    atomGroup = null;
    electronObjects.value = [];
    console.log('Three.js cleanup complete.');
  };

  const handleResize = () => {
    if (!camera || !renderer || !containerRef.value) return;
    console.log('Handling resize...');
    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;
    if (width === 0 || height === 0) {
      console.warn("Resize handler called with zero dimensions, skipping update.");
      return;
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    console.log(`Resized renderer to ${width}x${height}`);
  };

  // --- Lifecycle Hooks & Watchers ---
  onMounted(() => {
    nextTick(() => {
      if (containerRef.value) {
        console.log('Canvas container is available in onMounted, initializing scene.');
        initScene();
      } else {
        console.error('Canvas container ref is null in onMounted after nextTick. Cannot initialize Three.js.');
      }
    });
  });

  onUnmounted(() => {
    console.log('useThreeAtomVisualizer triggering cleanup on component unmount.');
    cleanup();
  });

  watch(elementData, (newData, oldData) => {
    if (!scene || !atomGroup || newData?.symbol === oldData?.symbol) return;
    console.log(`Watcher: Element changed from ${oldData?.symbol || 'none'} to ${newData?.symbol}. Recreating model...`);
    createAtomModel(newData);
  });

  watch(containerRef, (newEl) => {
    if (newEl && !renderer) {
      console.log("Watcher (containerRef): Canvas ref became available post-mount. Initializing scene.");
      initScene();
    } else if (!newEl && renderer) {
      console.log("Watcher (containerRef): Canvas ref removed. Cleaning up.");
      cleanup();
    }
  });

  return {};
}

console.log('Composable "useThreeAtomVisualizer" defined.');

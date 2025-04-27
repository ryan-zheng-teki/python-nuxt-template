import { ref } from 'vue';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

/**
 * Manages the Three.js scene and all step-based animations for the
 * "Circle Circumference" problem with radius 5cm.
 */
export function useGeometryCircleAnimation() {
  // Local refs for scene objects
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let animationFrameId: number | null = null;
  let canvasContainer: HTMLElement | null = null;
  let controls: any = null; // OrbitControls type
  // Object refs
  let mainCircle: THREE.Mesh | null = null;
  let radiusLine: THREE.Line | null = null;
  let radiusLabel: HTMLElement | null = null;
  let arcHighlight: THREE.Line | null = null;
  let piFormulaSprite: THREE.Sprite | null = null;
  let substituteSprite: THREE.Sprite | null = null;
  let simplifySprite: THREE.Sprite | null = null;
  let approxSprite: THREE.Sprite | null = null;

  // --- For label overlays in DOM over the canvas ---
  function addRadiusLabel(x: number, y: number, domParent: HTMLElement) {
    removeRadiusLabel();
    const lbl = document.createElement('div');
    lbl.textContent = 'r = 5 cm';
    lbl.className =
      'absolute top-2 left-2 px-2 py-1 text-xs sm:text-base rounded bg-blue-600 text-white font-bold shadow pointer-events-none ring-2 ring-blue-200 select-none';
    lbl.style.transform = `translate(-50%, 0)`;
    domParent.appendChild(lbl);
    radiusLabel = lbl;
  }
  function removeRadiusLabel() {
    if (radiusLabel && radiusLabel.parentNode) radiusLabel.parentNode.removeChild(radiusLabel);
    radiusLabel = null;
  }

  // -- Utility: create a Sprite with text/html on transparent BG --
  function createLatexSprite(tex: string, color: string = '#111') {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 90;
    const ctx = canvas.getContext('2d')!;
    ctx.font = '32px TeX Gyre Adventor, Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(tex, canvas.width / 2, canvas.height / 2 + 2);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(3.1, 0.75, 1);
    return sprite;
  }

  // --- STEP 0: Setup THE CIRCLE scene
  function setupScene(el: HTMLElement) {
    cleanup(); // Remove old scene if any

    // 1. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0xf3f6fa, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(el.clientWidth, el.clientHeight);

    // 2. Scene
    scene = new THREE.Scene();

    // 3. Camera
    camera = new THREE.PerspectiveCamera(
      45,
      el.clientWidth / el.clientHeight,
      0.01,
      1000
    );
    camera.position.set(0, 0, 18);
    camera.lookAt(0, 0, 0);

    // 4. Lighting (soft)
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    // 5. Main Circle (radius scaled for visualization)
    const RADIUS = 5;
    const circleGeometry = new THREE.CircleGeometry(RADIUS, 128);
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0x8cc1fc,
      opacity: 0.18,
      transparent: true,
      side: THREE.DoubleSide,
    });
    mainCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    // Only show from step 0 onward
    scene.add(mainCircle);

    // 6. Circle outline
    const outlineGeom = new THREE.RingGeometry(RADIUS - 0.055, RADIUS + 0.055, 128);
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x0969da, linewidth: 3,
      side: THREE.DoubleSide,
    });
    const circleOutline = new THREE.Mesh(outlineGeom, outlineMat);
    scene.add(circleOutline);

    // 7. Draw radius line (from center to right edge)
    const rGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0.01),
      new THREE.Vector3(RADIUS, 0, 0.01),
    ]);
    radiusLine = new THREE.Line(
      rGeom,
      new THREE.LineDashedMaterial({
        color: 0xda3e09,
        dashSize: 0.45,
        gapSize: 0.25,
        linewidth: 3,
      })
    );
    radiusLine.computeLineDistances();
    scene.add(radiusLine);

    // 8. Arc highlight for "circumference"
    const arcHighlightGeom = new THREE.BufferGeometry();
    let arcVerts: THREE.Vector3[] = [];
    // Draw a 360-degree arc (hidden at first, then animate in step 3)
    for (let i = 0; i <= 128; ++i) {
      let theta = (i / 128) * Math.PI * 2;
      arcVerts.push(
        new THREE.Vector3(
          RADIUS * Math.cos(theta),
          RADIUS * Math.sin(theta),
          0.05
        )
      );
    }
    arcHighlightGeom.setFromPoints(arcVerts);
    arcHighlight = new THREE.Line(
      arcHighlightGeom,
      new THREE.LineBasicMaterial({
        color: 0x0db46b,
        linewidth: 6,
      })
    );
    arcHighlight.visible = false;
    scene.add(arcHighlight);

    // 9. Label for "r = 5cm" (dom overlay, not ThreeJS)
    addRadiusLabel(0, 0, el);

    // 10. Formula Sprites (hidden until steps)
    piFormulaSprite = createLatexSprite('C = 2πr', '#1853be');
    piFormulaSprite.visible = false;
    piFormulaSprite.position.set(0, -7, 0);
    scene.add(piFormulaSprite);

    substituteSprite = createLatexSprite('C = 2π × 5', '#88399e');
    substituteSprite.visible = false;
    substituteSprite.position.set(0, -7, 0);
    scene.add(substituteSprite);

    simplifySprite = createLatexSprite('C = 10π cm', '#40702d');
    simplifySprite.visible = false;
    simplifySprite.position.set(0, -7, 0);
    scene.add(simplifySprite);

    approxSprite = createLatexSprite('C = 31.4 cm', '#24897a');
    approxSprite.visible = false;
    approxSprite.position.set(0, -7, 0);
    scene.add(approxSprite);

    // 11. Render
    el.appendChild(renderer.domElement);
    renderer.domElement.style.borderRadius = '1rem';
    canvasContainer = el;
    onResize();
    window.addEventListener('resize', onResize);

    animateLoop();
  }

  function onResize() {
    if (!renderer || !camera || !canvasContainer) return;
    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // --- STEPWISE STATE ----

  function goToStep(step: number) {
    if (!scene) return;
    // Clean all label overlays
    removeRadiusLabel();
    if (canvasContainer) addRadiusLabel(0, 0, canvasContainer);

    // Hide all formula sprites
    piFormulaSprite!.visible = false;
    substituteSprite!.visible = false;
    simplifySprite!.visible = false;
    approxSprite!.visible = false;

    // Hide arc highlight
    arcHighlight!.visible = false;
    arcHighlight!.material.opacity = 0.23;

    switch (step) {
      case 0:
        showStep1();
        break;
      case 1:
        showStep2();
        break;
      case 2:
        showStep3();
        break;
      case 3:
      default:
        showStep4();
    }
  }

  // --- Step 1: Show circle + radius + formula ---
  function showStep1() {
    piFormulaSprite!.visible = true;
    substituteSprite!.visible = false;
    simplifySprite!.visible = false;
    approxSprite!.visible = false;
    arcHighlight!.visible = false;
    arcHighlight!.material.opacity = 0.23;
    fadeCameraTo(new THREE.Vector3(0, 0, 18), 0.06);
  }
  // --- Step 2: Show substituted formula, keep rest ---
  function showStep2() {
    piFormulaSprite!.visible = false;
    substituteSprite!.visible = true;
    simplifySprite!.visible = false;
    approxSprite!.visible = false;
    arcHighlight!.visible = false;
    arcHighlight!.material.opacity = 0.23;
    fadeCameraTo(new THREE.Vector3(0, 0, 17.5), 0.05);

    // Briefly animate a "pulse" on the radius line
    pulseObject(radiusLine!, 0xda3e09, 0xfbbf24, 350, 3);
  }
  // --- Step 3: Show "C = 10π cm" and animate arc highlight ---
  function showStep3() {
    piFormulaSprite!.visible = false;
    substituteSprite!.visible = false;
    simplifySprite!.visible = true;
    approxSprite!.visible = false;
    arcHighlight!.visible = true;
    arcHighlight!.material.opacity = 1;
    arcHighlight!.material.color.set(0x0db46b);
    animateArcSweep();
    fadeCameraTo(new THREE.Vector3(0, 0, 16.5), 0.07);
  }
  // --- Step 4: Show approx, fade arc, bring in final answer ---
  function showStep4() {
    piFormulaSprite!.visible = false;
    substituteSprite!.visible = false;
    simplifySprite!.visible = false;
    approxSprite!.visible = true;
    arcHighlight!.visible = true;
    fadeCameraTo(new THREE.Vector3(0, 0, 15), 0.09);
    // Fade in arc/lighter color for highlighting
    TWEEN.removeAll();
    const arcMat = arcHighlight!.material as THREE.LineBasicMaterial;
    arcMat.opacity = 0.22;
    arcMat.color.set(0x3ddcb8);
  }

  // --- Utility animation functions ---
  function fadeCameraTo(pos: THREE.Vector3, t: number = 0.09) {
    if (!camera) return;
    new TWEEN.Tween(camera.position)
      .to({ x: pos.x, y: pos.y, z: pos.z }, Math.max(250, t * 900))
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  }
  function pulseObject(obj: THREE.Line, from: number, to: number, dur: number, n: number) {
    let count = 0;
    function pulse() {
      if (count++ >= n) {
        (obj.material as any).color.set(from);
        return;
      }
      new TWEEN.Tween(obj.material.color)
        .to(new THREE.Color(to), dur)
        .yoyo(true)
        .repeat(1)
        .onComplete(pulse)
        .start();
    }
    pulse();
  }

  /** Animates revealing the circumference arc with a "drawing" sweep effect (step 3) */
  function animateArcSweep() {
    if (!arcHighlight) return;
    // The arcHighlight has 129 points (0..128) covering 0 to 2π.
    // We'll animate its "draw range"
    (arcHighlight.material as THREE.LineBasicMaterial).opacity = 1;
    arcHighlight.visible = true;
    arcHighlight.geometry.setDrawRange(0, 0);

    // Reveal arc in 900ms
    const arc = { n: 0 };
    new TWEEN.Tween(arc)
      .to({ n: 129 }, 900)
      .onUpdate(() => {
        arcHighlight.geometry.setDrawRange(0, arc.n | 0);
      })
      .onComplete(() => {
        arcHighlight.geometry.setDrawRange(0, 129);
      })
      .start();
  }

  // --- Animation Loop ---
  function animateLoop() {
    animationFrameId = requestAnimationFrame(animateLoop);
    TWEEN.update();
    renderer?.render(scene!, camera!);
  }

  function cleanup() {
    // Remove ThreeJs resources & listeners, overlays
    if (renderer && renderer.domElement && renderer.domElement.parentNode)
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    if (canvasContainer) removeRadiusLabel();
    window.removeEventListener('resize', onResize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    renderer = null;
    camera = null;
    scene = null;
    mainCircle = null;
    radiusLine = null;
    arcHighlight = null;
  }

  // Public API for the composable
  return {
    setupScene,
    goToStep,
    cleanup,
  };
}
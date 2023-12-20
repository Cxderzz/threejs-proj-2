import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js";

// Shaders
import { ShaderPass } from "https://unpkg.com/three@0.116.1/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "//unpkg.com/three@0.116.1/examples/jsm/postprocessing/RenderPass.js";
import { FilmGrainShader } from "./FilmGrainShader.js";
import { LensDistortionShader } from "./LensDistortionShader.js";
import { FXAAShader } from "//unpkg.com/three@0.116.1/examples/jsm/shaders/FXAAShader.js";
import { GammaCorrectionShader } from "//unpkg.com/three@0.116.1/examples/jsm/shaders/GammaCorrectionShader.js";
import { EffectComposer } from "//unpkg.com/three@0.116.1/examples/jsm/postprocessing/EffectComposer.js";
import { CopyShader } from "//unpkg.com/three@0.116.1/examples/jsm/shaders/CopyShader.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

var container, controls;
var camera, scene, renderer, mixer, clock;
var portalObject;
let eventListenerActive = false;
// Add event listener for mousemove
var renderPass, distortPass, grainPass, gammaPass, fxaaPass;
var composer;
var mesh;
var params = {
  enableNoise: true,
  noiseSpeed: 0.02,
  noiseIntensity: 0.025,

  enableDistortion: true,
  baseIor: 0.8,
  bandOffset: 0.003,
  jitterIntensity: 1.0,
  samples: 7,
  distortionMode: "rygcbv",
  threshold: 0.5,
  strength: 0.01,
  radius: 0,
  exposure: 0.01,
};
const textureMap = {};

init();
animate();
// animate_dos();
function init() {
  container = document.querySelector(".webgl");
  // run mouse enter event listener
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
  camera.position.set(-1.5, 0.1, 4);

  scene = new THREE.Scene();

  clock = new THREE.Clock();

  var loader = new GLTFLoader();
  loader.load("models/SorensTHing_1.glb", function (gltf) {
    // render();
    portalObject = gltf.scene;
    scene.add(portalObject);
    portalObject.position.x = 0;
    portalObject.position.y = 0;
    // Define the function to handle mousemove event
    // add event listener
    if (container.matches(":hover") && eventListenerActive == false) {
      console.log("run event listener");
      window.addEventListener("mousemove", onMouseMove, false);
    }
    // only activate if user is hovering over the .webgl element, hint: container.matches(":hover")

    mixer = new THREE.AnimationMixer(portalObject);

    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
      // if (container.matches(":hover") && eventListenerActive == false) {
      //   console.log("run event listener");
      //   window.addEventListener("mousemove", onMouseMove, false);
      // } else if (!container.matches(":hover") && eventListenerActive == true) {
      //   window.removeEventListener("mousemove", onMouseMove, false);
      //   console.log("remove event listener");
      // } else {
      //   console.log("you failed");
      // }
      // // gltf.scene.rotation.x += 0.001;
    });
  });
  // .setPath("models")

  // new RGBELoader()
  //   .setDataType(THREE.UnsignedByteType)
  //   .load("models/bg.hdr", function (texture) {
  //     var envMap = pmremGenerator.fromEquirectangular(texture).texture;

  //     scene.background = envMap;
  //     scene.environment = envMap;

  //     texture.dispose();
  //     pmremGenerator.dispose();

  //     // model
  //   });

  // Load the background texture
  // var textureOne = THREE.ImageUtils.loadTexture("bg.png");
  // var backgroundMesh = new THREE.Mesh(
  //   new THREE.PlaneGeometry(2, 2, 0),
  //   new THREE.MeshBasicMaterial({
  //     map: textureOne,
  //   })
  // );

  // // backgroundMesh.material.depthTest = false;
  // // backgroundMesh.material.depthWrite = false;

  // // Create your background scene
  // scene.add(backgroundMesh);

  // const loaderBg = new THREE.TextureLoader();
  // scene.background = loaderBg.load("models/bg.png");
  // var material = new THREE.MeshBasicMaterial({
  //   side: THREE.DoubleSide,
  // });
  // const planeGeometry = new THREE.PlaneBufferGeometry();
  // mesh = new THREE.Mesh(planeGeometry, material);
  // scene.add(mesh);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(document.body.clientWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xcccccc));

  var pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  renderPass = new RenderPass(scene, camera);
  grainPass = new ShaderPass(FilmGrainShader);
  gammaPass = new ShaderPass(GammaCorrectionShader);
  fxaaPass = new ShaderPass(FXAAShader);
  distortPass = new ShaderPass(LensDistortionShader);
  distortPass.material.defines.CHROMA_SAMPLES = params.samples;
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = params.threshold;
  bloomPass.strength = params.strength;
  bloomPass.radius = params.radius;

  const outputPass = new OutputPass();
  composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.setPixelRatio(window.devicePixelRatio);
  composer.addPass(renderPass);
  composer.addPass(gammaPass);
  composer.addPass(fxaaPass);
  composer.addPass(distortPass);
  composer.addPass(grainPass);
  // composer.addPass(bloomPass);
  // composer.addPass(outputPass);
  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.minDistance = 2;
  // controls.maxDistance = 10;
  // controls.target.set(0, 0, -0.2);
  // controls.enablePan = false;
  // controls.enableZoom = false;
  // controls.enableDamping = true;
  // controls.autoRotate = true;
  // controls.autoRotateSpeed = 0.5;
  // controls.minPolarAngle = Math.PI / 2;
  // controls.maxPolarAngle = Math.PI / 2;
  // controls.update();
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onMouseMove(event) {
  // Calculate the normalized mouse position within the window
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(event.clientY);
  // Define the amount of wiggle or displacement
  const wiggleAmount = 0.0005;

  // Apply the wiggle effect based on mouse movement
  const wiggleX = mouseY * wiggleAmount;
  const wiggleY = mouseX * wiggleAmount;
  // console.log(wiggleX, wiggleY);
  const maxWiggle = 0.1;
  const wiggleReturnConstant = 4 * wiggleAmount;
  // Apply the slight rotation or transformation to the object
  if (
    portalObject.position.x < maxWiggle &&
    portalObject.position.x > -maxWiggle &&
    portalObject.position.y < maxWiggle &&
    portalObject.position.y > -maxWiggle
  ) {
    portalObject.position.x += wiggleX;
    portalObject.position.y += wiggleY;
  } else {
    console.log("max-wiggle detected");
    // slowly move object back to target point
    if (portalObject.position.x > 0) {
      portalObject.position.x -= wiggleReturnConstant;
      console.log(
        "moving x back to target point by -0.1x" + portalObject.position.x
      );
    } else {
      portalObject.position.x += wiggleReturnConstant;
      console.log(
        "moving x back to target point neg by +0.1x" + portalObject.position.x
      );
    }
    if (portalObject.position.y > 0) {
      portalObject.position.y -= wiggleReturnConstant;
      console.log(
        "moving y back to target point by -0.1y " + portalObject.position.y
      );
    } else {
      portalObject.position.y += wiggleReturnConstant;
      console.log(
        "moving y back to target point neg by +0.1y" + portalObject.position.y
      );
    }
    console.log(portalObject.position);
  }
}

function onMouseEnterHandler() {
  console.log("mouse enter");
  if (eventListenerActive == false) {
    eventListenerActive = true;
  }
}

//

function animate() {
  // controls.update();
  requestAnimationFrame(animate);

  // if (container.matches(":hover") && eventListenerActive == false) {
  //   console.log("run event listener");
  //   window.addEventListener("mousemove", onMouseMove, false);
  // } else if (!container.matches(":hover") && eventListenerActive == true) {
  //   window.removeEventListener("mousemove", onMouseMove, false);
  //   console.log("remove event listener");
  // } else {
  //   console.log("you failed");
  // }
  render();
  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);
}

function render() {
  grainPass.enabled = true;
  grainPass.material.uniforms.noiseOffset.value += 0.0168;
  grainPass.material.uniforms.intensity.value = 0.025;

  distortPass.enabled = true;
  distortPass.material.uniforms.baseIor.value = 0.97;
  distortPass.material.uniforms.bandOffset.value = 0.004;
  distortPass.material.uniforms.jitterOffset.value += 0.01;
  distortPass.material.uniforms.jitterIntensity.value = 0;

  // const tex =
  //   textureMap[params.image] ||
  //   new THREE.TextureLoader().load(`models/bg.png`, () => {
  //     tex.needsUpdate = true;
  //   });
  // mesh.material.map = tex;

  // if (tex.image) {
  //   const aspect = tex.image.width / tex.image.height;
  //   mesh.scale.set(7 * aspect, 7, 1);
  // }

  // composer.render();

  renderer.render(scene, camera);
  composer.render();
}

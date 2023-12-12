import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

// HTML

// Mouse pos

let mousePrevious = new THREE.Vector2();
let mouseCurrent = new THREE.Vector2();
let mouseDelta = new THREE.Vector2();

// Scene
const scene = new THREE.Scene();

// Create the spehere
const geometry = new THREE.SphereGeometry(3, 64, 64);

const material = new THREE.MeshNormalMaterial({
  wireframe: true,
  flatShading: false,
});

// Create the mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
// Lights

// Sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const light = new THREE.PointLight(0xffffff, 100);
light.position.set(0, 10, 10);
scene.add(light);
// Camera

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// Renderer

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Resize

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);

  console.log("resizing! - dev");
});
sphere.position.x = 7.5;

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouseCurrent.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseCurrent.y = -(event.clientY / window.innerHeight) * 2 + 1;
  mouseDelta = mousePrevious.sub(mouseCurrent);
  mousePrevious.copy(mouseCurrent);
  console.log(mouseDelta);
}

const loop = () => {
  // Rotate the sphere
  sphere.rotation.y += 0.01; // Adjust the rotation speed as needed
  sphere.rotation.x += 0.01; // Adjust the rotation speed as needed

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
renderer.domElement.addEventListener("mousemove", onDocumentMouseMove, false);

loop();

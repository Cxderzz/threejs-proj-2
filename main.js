import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// Scene
const scene = new THREE.Scene();

// Create the spehere
const geometry = new THREE.SphereGeometry(3, 64, 64);

// Create the material

// const material = new THREE.MeshStandardMaterial({
//   color: "#00ff83",
// });

const material = new THREE.MeshNormalMaterial({
  wireframe: true,
  color: "#00ff83",
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

// Controls

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 5;

// // move the sphere down to the bottom 25% of the canvas without using a constant value
// // sphere.position.y = -2.5;
// // sphere.position.x = 5;
// controls.target.set(0, 5, 0);
// sphere.position.y = 0;
// stop the sphere from moving, just keep it spinning in place

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
  // renderer.render(scene, camera);

  console.log("resizing! - dev");
});
sphere.position.x = 7.5;
const loop = () => {
  // controls.update();

  // Rotate the sphere
  sphere.rotation.y += 0.01; // Adjust the rotation speed as needed
  sphere.rotation.x += 0.01; // Adjust the rotation speed as needed
  // Move the sphere to the right-hand side of the canvas
  // const distanceFromCenter = 10; // Set the distance from the center of the canvas
  // sphere.position.x = Math.cos(sphere.rotation.y) * distanceFromCenter;
  // sphere.position.z = Math.sin(sphere.rotation.y) * distanceFromCenter;

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// // Scene
// const scene = new THREE.Scene();

// // Create the sphere
// const geometry = new THREE.SphereGeometry(3, 64, 64);

// // Create the material
// const material = new THREE.MeshStandardMaterial({
//   color: "#00ff83",
// });

// // Create the mesh
// const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

// // Set initial position of the sphere (on the right-hand side)
// sphere.position.set(5, -2.5, 0);

// // Lights
// const light = new THREE.PointLight(0xffffff, 100);
// light.position.set(0, 10, 10);
// scene.add(light);

// // Sizes
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// // Camera
// const camera = new THREE.PerspectiveCamera(
//   45,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.z = 20;
// scene.add(camera);

// // Renderer
// const canvas = document.querySelector(".webgl");
// const renderer = new THREE.WebGLRenderer({
//   canvas,
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.render(scene, camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
// controls.autoRotate = false;

// // Variable to track mouse position
// let previousMousePosition = {
//   x: 0,
//   y: 0,
// };

// // Function to handle mouse movement
// const onMouseMove = (event) => {
//   const mousePosition = {
//     x: event.clientX,
//     y: event.clientY,
//   };

//   // Calculate the change in mouse position
//   const deltaMousePosition = {
//     x: mousePosition.x - previousMousePosition.x,
//     y: mousePosition.y - previousMousePosition.y,
//   };

//   // Update previous mouse position
//   previousMousePosition = mousePosition;

//   // Rotate the sphere based on mouse movement
//   sphere.rotation.y += deltaMousePosition.x * 0.01;
//   sphere.rotation.x += deltaMousePosition.y * 0.01;
// };

// // Event listener for mouse movement
// window.addEventListener("mousemove", onMouseMove);

// // Function to animate the scene
// const animate = () => {
//   controls.update();
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// };

// animate();

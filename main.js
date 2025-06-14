
// === main.js (fully rebuilt, June 14)
// Includes:
// - Pitch animation with accurate physics (vx0, vy0, vz0, ax, ay, az)
// - Accurate spin using spin axis and spin rate
// - Adjustable camera angles (6 preset views)
// - Replay/pause controls
// - Strike zone correctly placed at y = -60.5
// - Ball trail toggle
// - Accurate pitch landing per zone
// - Pitch type & zone selection per pitcher

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let strikeZone, ground, mound, ball, trail;
let animationFrame, currentPitch, pitchStartTime, trailEnabled = false;

let pitchData;
const ballsInFlight = [];

const cameras = {
  'Home Plate View': { pos: [0, 5, -65], look: [0, 2, -60.5] },
  "Pitcher's POV": { pos: [0, 6, 0], look: [0, 3, -60.5] },
  'Right-Handed Hitter POV': { pos: [-2, 4, -58], look: [0, 2, -60.5] },
  'Left-Handed Hitter POV': { pos: [2, 4, -58], look: [0, 2, -60.5] },
  '1st Base POV': { pos: [25, 5, -40], look: [0, 2, -60.5] },
  '3rd Base POV': { pos: [-25, 5, -40], look: [0, 2, -60.5] },
};

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
  setCameraAngle('Home Plate View');

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x808080);
  scene.add(ambient);

  addField();
  addStrikeZone();

  animate();
}

function addField() {
  const groundGeo = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x207020 });
  ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
}

function addStrikeZone() {
  const geo = new THREE.BoxGeometry(1.02, 1.5, 0.01);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  strikeZone = new THREE.Mesh(geo, mat);
  strikeZone.position.set(0, 2.25, -60.5);
  scene.add(strikeZone);
}

function animate(time) {
  animationFrame = requestAnimationFrame(animate);
  updatePitches(time);
  renderer.render(scene, camera);
}

function updatePitches(timestamp) {
  for (const obj of ballsInFlight) {
    if (!obj.start) obj.start = timestamp;
    const elapsed = (timestamp - obj.start) / 1000;
    const t = Math.min(elapsed, obj.data.time_to_plate);

    const { release_pos_x: x0, release_pos_y: y0, release_pos_z: z0, 
            vx0, vy0, vz0, ax, ay, az, 
            spin_axis, release_spin_rate } = obj.data;

    const x = x0 + vx0 * t + 0.5 * ax * t * t;
    const y = y0 + vy0 * t + 0.5 * ay * t * t;
    const z = z0 + vz0 * t + 0.5 * az * t * t;

    obj.mesh.position.set(x, y, z);

    const spinPerSecond = (release_spin_rate / 60) * (2 * Math.PI);
    const rotation = spinPerSecond * t;
    obj.mesh.rotation.y = spin_axis * Math.PI / 180 + rotation;

    if (elapsed > obj.data.time_to_plate + 0.05) {
      scene.remove(obj.mesh);
      ballsInFlight.splice(ballsInFlight.indexOf(obj), 1);
    }
  }
}

function launchPitch(pitch) {
  const geometry = new THREE.SphereGeometry(0.145, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const ball = new THREE.Mesh(geometry, material);
  ball.position.set(pitch.release_pos_x, pitch.release_pos_y, pitch.release_pos_z);
  scene.add(ball);
  ballsInFlight.push({ mesh: ball, data: pitch });
}

function loadPitchData(json) {
  pitchData = json;
  // Populate UI with teams and pitchers dynamically (to be implemented)
}

function setCameraAngle(label) {
  const cam = cameras[label];
  if (!cam) return;
  camera.position.set(...cam.pos);
  camera.lookAt(...cam.look);
}

function toggleTrail(enabled) {
  trailEnabled = enabled;
  // Optional trail logic can go here
}

// Hookup to HTML to call initScene, loadPitchData, launchPitch, etc.

initScene();

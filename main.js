
import * as THREE from 'three';

let scene, camera, renderer;
let ball, trail;
let animationId;
let startTime;
let pitchData = {};
let currentPitch = null;
let showTrail = false;

const STRIKE_ZONE_Z = 2.5;  // Approx center of strike zone in feet
const PLATE_Y = -60.5;      // Home plate distance
const FPS = 60;
const T_TOTAL = 0.45; // Total time of pitch flight in seconds

function initScene() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -65, 3);
    camera.lookAt(0, -60.5, 3);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(0, -50, 50);
    scene.add(directional);

    const zone = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.01, 2),  // width, depth, height in feet
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
    );
    zone.position.set(0, PLATE_Y, STRIKE_ZONE_Z);
    scene.add(zone);
}

function loadPitchData(json) {
    pitchData = json;
    // Additional dropdown UI population logic goes here
}

function createBall(color) {
    const geometry = new THREE.SphereGeometry(0.145, 32, 32); // Regulation ball size ~1.74" radius
    const material = new THREE.MeshStandardMaterial({ color });
    return new THREE.Mesh(geometry, material);
}

function animatePitch(pitch) {
    if (ball) scene.remove(ball);
    if (trail) scene.remove(trail);

    const x0 = pitch.release_pos_x;
    const y0 = -60.5 + pitch.release_extension;
    const z0 = pitch.release_pos_z;
    const vx0 = pitch.vx0;
    const vy0 = pitch.vy0;
    const vz0 = pitch.vz0;
    const ax = pitch.ax;
    const ay = pitch.ay;
    const az = pitch.az;

    ball = createBall(0xff0000);  // TODO: Color by pitch type
    ball.position.set(x0, y0, z0);
    scene.add(ball);

    startTime = performance.now();

    function updateFrame(now) {
        const t = (now - startTime) / 1000;
        if (t > T_TOTAL) return;

        const x = x0 + vx0 * t + 0.5 * ax * t * t;
        const y = y0 + vy0 * t + 0.5 * ay * t * t;
        const z = z0 + vz0 * t + 0.5 * az * t * t;

        ball.position.set(x, y, z);
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(updateFrame);
    }

    animationId = requestAnimationFrame(updateFrame);
}

export { initScene, loadPitchData, animatePitch };

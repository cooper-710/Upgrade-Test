import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.module.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.module.js';






// === UI Styling (Professional + Mobile-Responsive) ===
// === UI Styling (Professional + Mobile-Responsive) ===


const style = document.createElement('style');
const style = document.createElement('style');


style.innerHTML = `
style.innerHTML = `


  #pitchCheckboxes {
  #pitchCheckboxes {


    display: grid;
    display: grid;


    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));


    gap: 6px;
    gap: 6px;


    margin-bottom: 12px;
    margin-bottom: 12px;


  }
  }


  .checkbox-group {
  .checkbox-group {


    display: flex;
    display: flex;


    align-items: center;
    align-items: center;


    gap: 6px;
    gap: 6px;


    background: rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.05);


    padding: 4px 8px;
    padding: 4px 8px;


    border-radius: 6px;
    border-radius: 6px;


  }
  }


  .checkbox-group label {
  .checkbox-group label {


    font-size: 13px;
    font-size: 13px;


  }
  }


  label {
  label {


    font-size: 14px;
    font-size: 14px;


    display: block;
    display: block;


    margin-bottom: 4px;
    margin-bottom: 4px;


  }
  }


  select, button {
  select, button {


    width: 100%;
    width: 100%;


    padding: 6px 10px;
    padding: 6px 10px;


    margin-bottom: 12px;
    margin-bottom: 12px;


    border-radius: 6px;
    border-radius: 6px;


    border: none;
    border: none;


    font-size: 14px;
    font-size: 14px;


    background: #333;
    background: #333;


    color: white;
    color: white;


    font-family: 'Segoe UI', sans-serif;
    font-family: 'Segoe UI', sans-serif;


  }
  }


  #controls {
  #controls {


    position: absolute;
    position: absolute;


    top: 12px;
    top: 12px;


    left: 12px;
    left: 12px;


    background: rgba(0, 0, 0, 0.4);
    background: rgba(0, 0, 0, 0.4);


    padding: 16px;
    padding: 16px;


    border-radius: 12px;
    border-radius: 12px;


    z-index: 100;
    z-index: 100;


    max-width: 90vw;
    max-width: 90vw;


    color: white;
    color: white;


    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);


  }
  }


  @media (max-width: 600px) {
  @media (max-width: 600px) {


    #controls {
    #controls {


      font-size: 12px;
      font-size: 12px;


      padding: 12px;
      padding: 12px;


      top: auto;
      top: auto;


      bottom: 12px;
      bottom: 12px;


      left: 12px;
      left: 12px;


      right: 12px;
      right: 12px;


    }
    }


    select, button {
    select, button {


      font-size: 13px;
      font-size: 13px;


    }
    }


  }
  }


`;
`;


document.head.appendChild(style);
document.head.appendChild(style);






let scene, camera, renderer, pitchData = {}, balls = [];
let scene, camera, renderer, pitchData = {}, balls = [];


let activeTypes = new Set(), playing = true;
let activeTypes = new Set(), playing = true;


let lastTime = 0;
let lastTime = 0;


const clock = new THREE.Clock();
const clock = new THREE.Clock();






async function loadPitchData() {
async function loadPitchData() {


  const res = await fetch('./pitch_data.json');
  const res = await fetch('./pitch_data.json');


  return await res.json();
  return await res.json();


}
}


function createHalfColorMaterial(pitchType) {
function createHalfColorMaterial(pitchType) {


  const colorMap = {
  const colorMap = {


    FF: '#FF0000', SL: '#0000FF', CH: '#008000', KC: '#4B0082',
    FF: '#FF0000', SL: '#0000FF', CH: '#008000', KC: '#4B0082',


    SI: '#FFA500', CU: '#800080', FC: '#808080', ST: '#008080',
    SI: '#FFA500', CU: '#800080', FC: '#808080', ST: '#008080',


    FS: '#00CED1', EP: '#FF69B4', KN: '#A9A9A9', SC: '#708090',
    FS: '#00CED1', EP: '#FF69B4', KN: '#A9A9A9', SC: '#708090',


    SV: '#000000', CS: '#A52A2A', FO: '#DAA520'
    SV: '#000000', CS: '#A52A2A', FO: '#DAA520'


  };
  };






  const baseType = pitchType.split(' ')[0];
  const baseType = pitchType.split(' ')[0];
  const hex = colorMap[baseType] || '#888888';
  const hex = colorMap[baseType] || '#888888';






  const canvas = document.createElement('canvas');
  const canvas = document.createElement('canvas');


  canvas.width = 2;
  canvas.width = 2;


  canvas.height = 2;
  canvas.height = 2;


  const ctx = canvas.getContext('2d');
  const ctx = canvas.getContext('2d');






  ctx.fillStyle = hex;
  ctx.fillStyle = hex;


  ctx.fillRect(0, 0, 2, 1);
  ctx.fillRect(0, 0, 2, 1);


  ctx.fillStyle = '#FFFFFF';
  ctx.fillStyle = '#FFFFFF';


  ctx.fillRect(0, 1, 2, 1);
  ctx.fillRect(0, 1, 2, 1);






  const texture = new THREE.CanvasTexture(canvas);
  const texture = new THREE.CanvasTexture(canvas);


  texture.minFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;


  texture.magFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;






  return new THREE.MeshStandardMaterial({
  return new THREE.MeshStandardMaterial({


    map: texture,
    map: texture,


    roughness: 0.4,
    roughness: 0.4,


    metalness: 0.1
    metalness: 0.1


  });
  });


}
}






function getSpinAxisVector(degrees) {
function getSpinAxisVector(degrees) {


  const radians = THREE.MathUtils.degToRad(degrees);
  const radians = THREE.MathUtils.degToRad(degrees);


  return new THREE.Vector3(Math.cos(radians), 0, Math.sin(radians)).normalize();
  return new THREE.Vector3(Math.cos(radians), 0, Math.sin(radians)).normalize();


}
}






function setupScene() {
function setupScene() {


  const canvas = document.getElementById('three-canvas');
  const canvas = document.getElementById('three-canvas');


  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });


  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);


  renderer.shadowMap.enabled = true;
  renderer.shadowMap.enabled = true;


  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // enables soft shadowing
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // enables soft shadowing






  scene = new THREE.Scene();
  scene = new THREE.Scene();


  scene.background = new THREE.Color(0x222222);
  scene.background = new THREE.Color(0x222222);






  // === Mound ===
  // === Mound ===


  const moundGeometry = new THREE.CylinderGeometry(2.0, 9, 2.0, 64);
  const moundGeometry = new THREE.CylinderGeometry(2.0, 9, 2.0, 64);


  const moundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown
  const moundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown


  const mound = new THREE.Mesh(moundGeometry, moundMaterial);
  const mound = new THREE.Mesh(moundGeometry, moundMaterial);


  mound.position.set(0, 0, 0);  // Just beneath the pitch release point
  mound.position.set(0, 0, 0);  // Just beneath the pitch release point


  scene.add(mound);
  scene.add(mound);


  mound.receiveShadow = true;
  mound.receiveShadow = true;


  mound.castShadow = false;
  mound.castShadow = false;










  // === Pitcher's Rubber ===
  // === Pitcher's Rubber ===


  const rubberGeometry = new THREE.BoxGeometry(1, 0.05, 0.18); // Width, height, depth in feet
  const rubberGeometry = new THREE.BoxGeometry(1, 0.05, 0.18); // Width, height, depth in feet


  const rubberMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const rubberMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });


  const rubber = new THREE.Mesh(rubberGeometry, rubberMaterial);
  const rubber = new THREE.Mesh(rubberGeometry, rubberMaterial);


  rubber.position.set(0, 1.05, 0);
  rubber.position.set(0, 1.05, 0);


  scene.add(rubber);
  scene.add(rubber);


  rubber.castShadow = true;
  rubber.castShadow = true;


  rubber.receiveShadow = true;
  rubber.receiveShadow = true;










  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);


  camera.position.set(0, 2.5, -65);
  camera.position.set(0, 2.5, -65);


  camera.lookAt(0, 2.5, 0);
  camera.lookAt(0, 2.5, 0);


  scene.add(camera);
  scene.add(camera);


  
  


  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));






  const hemiLight = new THREE.HemisphereLight(0xb1e1ff, 0x8b4513, 0.4); 
  const hemiLight = new THREE.HemisphereLight(0xb1e1ff, 0x8b4513, 0.4); 


// Sky blue tint from above, dirt brown bounce from below
// Sky blue tint from above, dirt brown bounce from below


  scene.add(hemiLight);
  scene.add(hemiLight);






  
  


  const dirLight = new THREE.DirectionalLight(0xfff0e5, 1.0); // warm sunlight
  const dirLight = new THREE.DirectionalLight(0xfff0e5, 1.0); // warm sunlight


  dirLight.position.set(5, 10, 5);
  dirLight.position.set(5, 10, 5);


  dirLight.castShadow = true;
  dirLight.castShadow = true;






  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.width = 1024;


  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.mapSize.height = 1024;


  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.near = 1;


  dirLight.shadow.camera.far = 100;
  dirLight.shadow.camera.far = 100;


  dirLight.shadow.camera.left = -20;
  dirLight.shadow.camera.left = -20;


  dirLight.shadow.camera.right = 20;
  dirLight.shadow.camera.right = 20;


  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.top = 20;


  dirLight.shadow.camera.bottom = -20;
  dirLight.shadow.camera.bottom = -20;






  const dirTarget = new THREE.Object3D();
  const dirTarget = new THREE.Object3D();


  dirTarget.position.set(0, 0, 0);
  dirTarget.position.set(0, 0, 0);


  scene.add(dirTarget);
  scene.add(dirTarget);


  dirLight.target = dirTarget;
  dirLight.target = dirTarget;






  scene.add(dirLight);
  scene.add(dirLight);














  const plateLight = new THREE.PointLight(0xffffff, 0.6, 100);
  const plateLight = new THREE.PointLight(0xffffff, 0.6, 100);


  plateLight.position.set(0, 3, -60.5);
  plateLight.position.set(0, 3, -60.5);


  scene.add(plateLight);
  scene.add(plateLight);






  const ground = new THREE.Mesh(
  const ground = new THREE.Mesh(


    new THREE.PlaneGeometry(200, 200),
    new THREE.PlaneGeometry(200, 200),


    new THREE.MeshStandardMaterial({ color: 0x1e472d, roughness: 1 })
    new THREE.MeshStandardMaterial({ color: 0x1e472d, roughness: 1 })


  );
  );


  ground.rotation.x = -Math.PI / 2;
  ground.rotation.x = -Math.PI / 2;


  scene.add(ground);
  scene.add(ground);


  ground.receiveShadow = true;
  ground.receiveShadow = true;






  const zone = new THREE.LineSegments(
  const zone = new THREE.LineSegments(


    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.42, 2.0)),
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.42, 2.0)),


    new THREE.LineBasicMaterial({ color: 0xffffff })
    new THREE.LineBasicMaterial({ color: 0xffffff })


  );
  );


  zone.position.set(0, 2.5, -60.5);
  zone.position.set(0, 2.5, -60.5);


  scene.add(zone);
  scene.add(zone);






  const shape = new THREE.Shape();
  const shape = new THREE.Shape();


  shape.moveTo(-0.85, 0);
  shape.moveTo(-0.85, 0);


  shape.lineTo(0.85, 0);
  shape.lineTo(0.85, 0);


  shape.lineTo(0.85, 0.5);
  shape.lineTo(0.85, 0.5);


  shape.lineTo(0, 1.0);
  shape.lineTo(0, 1.0);


  shape.lineTo(-0.85, 0.5);
  shape.lineTo(-0.85, 0.5);


  shape.lineTo(-0.85, 0);
  shape.lineTo(-0.85, 0);


  const plate = new THREE.Mesh(
  const plate = new THREE.Mesh(


    new THREE.ShapeGeometry(shape),
    new THREE.ShapeGeometry(shape),


    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })


  );
  );


  plate.rotation.x = -Math.PI / 2;
  plate.rotation.x = -Math.PI / 2;


  plate.position.set(0, 0.011, -60.5);
  plate.position.set(0, 0.011, -60.5);


  scene.add(plate);
  scene.add(plate);






  window.addEventListener('resize', () => {
  window.addEventListener('resize', () => {


    camera.aspect = window.innerWidth / window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;


    camera.updateProjectionMatrix();
    camera.updateProjectionMatrix();


    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);


  });
  });


}
}






function clearBalls() {
function clearBalls() {


  for (let ball of balls) scene.remove(ball);
  for (let ball of balls) scene.remove(ball);


  balls = [];
  balls = [];


  activeTypes.clear();
  activeTypes.clear();


  document.getElementById('pitchCheckboxes').innerHTML = '';
  document.getElementById('pitchCheckboxes').innerHTML = '';


}
}








function addCheckboxes(pitcherData) {
function addCheckboxes(pitcherData) {
  const container = document.getElementById('pitchCheckboxes');
  const container = document.getElementById('pitchCheckboxes');
  container.innerHTML = '';
  container.innerHTML = '';


  const pitchGroups = {};
  const pitchGroups = {};


  for (const key in pitcherData) {
  for (const key in pitcherData) {
    const [pitchType, zone] = key.split(' ');
    const [pitchType, zone] = key.split(' ');
    if (!pitchGroups[pitchType]) pitchGroups[pitchType] = {};
    if (!pitchGroups[pitchType]) pitchGroups[pitchType] = {};
    pitchGroups[pitchType][Number(zone)] = pitcherData[key];
    pitchGroups[pitchType][Number(zone)] = pitcherData[key];
  }
  }


  Object.keys(pitchGroups).forEach(pitchType => {
  Object.keys(pitchGroups).forEach(pitchType => {
    const group = document.createElement('div');
    const group = document.createElement('div');
    group.className = 'pitch-type-group';
    group.className = 'pitch-type-group';
    group.style.display = 'block'; // guaranteed block layout
    group.style.display = 'block'; // guaranteed block layout


    const title = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'pitch-type-title';
    title.className = 'pitch-type-title';
    title.textContent = pitchType;
    title.textContent = pitchType;


    const grid = document.createElement('div');
    const grid = document.createElement('div');
    grid.className = 'checkbox-grid';
    grid.className = 'checkbox-grid';


    for (let zone = 1; zone <= 9; zone++) {
    for (let zone = 1; zone <= 9; zone++) {
      const combo = `${pitchType} ${zone}`;
      const combo = `${pitchType} ${zone}`;
      if (!pitchGroups[pitchType][zone]) continue;
      if (!pitchGroups[pitchType][zone]) continue;


      const checkbox = document.createElement('input');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.type = 'checkbox';
      checkbox.id = combo;
      checkbox.id = combo;


      checkbox.addEventListener('change', () => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
        if (checkbox.checked) {
          throwBall(pitchGroups[pitchType][zone], combo);
          throwBall(pitchGroups[pitchType][zone], combo);
        } else {
        } else {
          removeBallByType(combo);
          removeBallByType(combo);
        }
        }
      });
      });


      const label = document.createElement('label');
      const label = document.createElement('label');
      label.htmlFor = combo;
      label.htmlFor = combo;
      label.textContent = zone;
      label.textContent = zone;


      const wrapper = document.createElement('div');
      const wrapper = document.createElement('div');
      wrapper.className = 'checkbox-group';
      wrapper.className = 'checkbox-group';
      wrapper.appendChild(checkbox);
      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      wrapper.appendChild(label);


      grid.appendChild(wrapper);
      grid.appendChild(wrapper);
    }
    }


    group.appendChild(title);
    group.appendChild(title);
    group.appendChild(grid);
    group.appendChild(grid);
    container.appendChild(group); // this matters most
    container.appendChild(group); // this matters most
  });
  });
}
}
function populateDropdowns(data) {
function populateDropdowns(data) {


  const teamSelect = document.getElementById('teamSelect');
  const teamSelect = document.getElementById('teamSelect');


  const pitcherSelect = document.getElementById('pitcherSelect');
  const pitcherSelect = document.getElementById('pitcherSelect');






  for (let team in data) {
  for (let team in data) {


    const option = document.createElement('option');
    const option = document.createElement('option');


    option.value = team;
    option.value = team;


    option.textContent = team;
    option.textContent = team;


    teamSelect.appendChild(option);
    teamSelect.appendChild(option);


  }
  }






  teamSelect.addEventListener('change', () => {
  teamSelect.addEventListener('change', () => {


    pitcherSelect.innerHTML = '';
    pitcherSelect.innerHTML = '';


    const team = teamSelect.value;
    const team = teamSelect.value;


    for (let pitcher in data[team]) {
    for (let pitcher in data[team]) {


      const opt = document.createElement('option');
      const opt = document.createElement('option');


      opt.value = pitcher;
      opt.value = pitcher;


      opt.textContent = pitcher;
      opt.textContent = pitcher;


      pitcherSelect.appendChild(opt);
      pitcherSelect.appendChild(opt);


    }
    }


    pitcherSelect.dispatchEvent(new Event('change'));
    pitcherSelect.dispatchEvent(new Event('change'));


  });
  });






  pitcherSelect.addEventListener('change', () => {
  pitcherSelect.addEventListener('change', () => {


    clearBalls();
    clearBalls();


    const team = teamSelect.value;
    const team = teamSelect.value;


    const pitcher = pitcherSelect.value;
    const pitcher = pitcherSelect.value;


    addCheckboxes(data[team][pitcher]);
    addCheckboxes(data[team][pitcher]);


  });
  });






  teamSelect.selectedIndex = 0;
  teamSelect.selectedIndex = 0;


  teamSelect.dispatchEvent(new Event('change'));
  teamSelect.dispatchEvent(new Event('change'));


}
}








function throwBall(pitch, pitchType) {
function throwBall(pitch, pitchType) {
  addBall(pitch, pitchType);
  addBall(pitch, pitchType);
}
}


function addBall(pitch, pitchType) {
function addBall(pitch, pitchType) {


  const ballGeo = new THREE.SphereGeometry(0.145, 32, 32);
  const ballGeo = new THREE.SphereGeometry(0.145, 32, 32);


  const mat = createHalfColorMaterial(pitchType);
  const mat = createHalfColorMaterial(pitchType);


  const ball = new THREE.Mesh(ballGeo, mat);
  const ball = new THREE.Mesh(ballGeo, mat);


  ball.castShadow = true;
  ball.castShadow = true;






  const t0 = clock.getElapsedTime();
  const t0 = clock.getElapsedTime();






  ball.userData = {
  ball.userData = {


    type: pitchType,
    type: pitchType,


    t0: t0,
    t0: t0,


    release: {
    release: {


      x: -pitch.release_pos_x,
      x: -pitch.release_pos_x,


      y: pitch.release_pos_z + 0.65,
      y: pitch.release_pos_z + 0.65,


      z: -2.03
      z: -2.03


    },
    },


    velocity: {
    velocity: {


      x: -pitch.vx0,
      x: -pitch.vx0,


      y: pitch.vz0,
      y: pitch.vz0,


      z: pitch.vy0
      z: pitch.vy0


    },
    },


    accel: {
    accel: {


      x: -pitch.ax,
      x: -pitch.ax,


      y: pitch.az,
      y: pitch.az,


      z: pitch.ay
      z: pitch.ay


    },
    },


    spinRate: pitch.release_spin_rate || 0,
    spinRate: pitch.release_spin_rate || 0,


    spinAxis: getSpinAxisVector(pitch.spin_axis || 0)
    spinAxis: getSpinAxisVector(pitch.spin_axis || 0)


  };
  };






  ball.position.set(
  ball.position.set(


    ball.userData.release.x,
    ball.userData.release.x,


    ball.userData.release.y,
    ball.userData.release.y,


    ball.userData.release.z
    ball.userData.release.z


  );
  );






  balls.push(ball);
  balls.push(ball);


  scene.add(ball);
  scene.add(ball);


}
}






function removeBall(pitchType) {
function removeBall(pitchType) {


  balls = balls.filter(ball => {
  balls = balls.filter(ball => {


    if (ball.userData.type === pitchType) {
    if (ball.userData.type === pitchType) {


      scene.remove(ball);
      scene.remove(ball);


      return false;
      return false;


    }
    }


    return true;
    return true;


  });
  });


}
}






function animate() {


  requestAnimationFrame(animate);
  requestAnimationFrame(animate);






  const now = clock.getElapsedTime();
  const now = clock.getElapsedTime();


  const delta = now - lastTime;
  const delta = now - lastTime;


  lastTime = now;
  lastTime = now;






  if (playing) {
  if (playing) {


    for (let ball of balls) {
    for (let ball of balls) {


      const { t0, release, velocity, accel, spinRate, spinAxis } = ball.userData;
      const { t0, release, velocity, accel, spinRate, spinAxis } = ball.userData;


      const t = now - t0;
      const t = now - t0;






      const z = release.z + velocity.z * t + 0.5 * accel.z * t * t;
      const z = release.z + velocity.z * t + 0.5 * accel.z * t * t;


      if (z <= -60.5) continue;
      if (z <= -60.5) continue;






      ball.position.x = release.x + velocity.x * t + 0.5 * accel.x * t * t;
      ball.position.x = release.x + velocity.x * t + 0.5 * accel.x * t * t;


      ball.position.y = release.y + velocity.y * t + 0.5 * accel.y * t * t;
      ball.position.y = release.y + velocity.y * t + 0.5 * accel.y * t * t;


      ball.position.z = z;

      const t = now - t0;
      const tFinal = ball.userData.timeToPlate;
      const clampedT = Math.min(t, tFinal);

      ball.position.x = release.x + velocity.x * clampedT + 0.5 * accel.x * clampedT * clampedT;
      ball.position.y = release.y + velocity.y * clampedT + 0.5 * accel.y * clampedT * clampedT;
      ball.position.z = release.z + velocity.z * clampedT + 0.5 * accel.z * clampedT * clampedT;

      if (t >= tFinal && !ball.userData.frozen) {
        ball.userData.frozen = true;
      }







      if (spinRate > 0) {
      if (spinRate > 0) {


        const radPerSec = (spinRate / 60) * 2 * Math.PI;
        const radPerSec = (spinRate / 60) * 2 * Math.PI;


        const angleDelta = radPerSec * delta;
        const angleDelta = radPerSec * delta;


        ball.rotateOnAxis(spinAxis.clone().normalize(), angleDelta);
        ball.rotateOnAxis(spinAxis.clone().normalize(), angleDelta);


      }
      }


    }
    }


  }
  }






  renderer.render(scene, camera);
  renderer.render(scene, camera);


}
}






// === UI Buttons ===
// === UI Buttons ===


document.getElementById('toggleBtn').addEventListener('click', () => {
document.getElementById('toggleBtn').addEventListener('click', () => {


  playing = !playing;
  playing = !playing;


  document.getElementById('toggleBtn').textContent = playing ? 'Pause' : 'Play';
  document.getElementById('toggleBtn').textContent = playing ? 'Pause' : 'Play';


});
});






document.getElementById('replayBtn').addEventListener('click', () => {
document.getElementById('replayBtn').addEventListener('click', () => {


  const now = clock.getElapsedTime();
  const now = clock.getElapsedTime();


  for (let ball of balls) {
  for (let ball of balls) {


    ball.userData.t0 = now;
    ball.userData.t0 = now;


    ball.position.set(
    ball.position.set(


      ball.userData.release.x,
      ball.userData.release.x,


      ball.userData.release.y,
      ball.userData.release.y,


      ball.userData.release.z
      ball.userData.release.z


    );
    );


  }
  }


});
});






// === Init ===
// === Init ===


(async () => {
(async () => {


  setupScene();
  setupScene();
  // === Camera View Dropdown Logic (Refined Positions) ===
  // === Camera View Dropdown Logic (Refined Positions) ===
document.getElementById("cameraSelect").addEventListener("change", (e) => {
document.getElementById("cameraSelect").addEventListener("change", (e) => {
  const view = e.target.value;
  const view = e.target.value;
  switch(view) {
  switch(view) {
    case "catcher":
    case "catcher":
      camera.position.set(0, 2.5, -65);
      camera.position.set(0, 2.5, -65);
      camera.lookAt(0, 2.5, 0);
      camera.lookAt(0, 2.5, 0);
      break;
      break;
    case "pitcher":
    case "pitcher":
      camera.position.set(0, 6.0, 5);  // slightly higher pitcher view
      camera.position.set(0, 6.0, 5);  // slightly higher pitcher view
      camera.lookAt(0, 2, -60.5);
      camera.lookAt(0, 2, -60.5);
      break;
      break;
    case "rhh":
    case "rhh":
      camera.position.set(1, 4, -65);  // higher right-handed hitter view
      camera.position.set(1, 4, -65);  // higher right-handed hitter view
      camera.lookAt(0, 1.5, 0);           // look at pitcher
      camera.lookAt(0, 1.5, 0);           // look at pitcher
      break;
      break;
    case "lhh":
    case "lhh":
      camera.position.set(-1, 4, -65); // higher left-handed hitter view
      camera.position.set(-1, 4, -65); // higher left-handed hitter view
      camera.lookAt(0, 1.5, 0);           // look at pitcher
      camera.lookAt(0, 1.5, 0);           // look at pitcher
      break;
      break;
    case "1b":
    case "1b":
      camera.position.set(50, 4.5, -30);
      camera.position.set(50, 4.5, -30);
      camera.lookAt(0, 5, -30);
      camera.lookAt(0, 5, -30);
      break;
      break;
    case "3b":
    case "3b":
      camera.position.set(-50, 4.5, -30);
      camera.position.set(-50, 4.5, -30);
      camera.lookAt(0, 5, -30);
      camera.lookAt(0, 5, -30);
      break;
      break;
  }
  }
});
});


  pitchData = await loadPitchData();
  pitchData = await loadPitchData();


  populateDropdowns(pitchData);
  populateDropdowns(pitchData);


  animate();
  animate();


})();
})();




function removeBallByType(pitchType) {
function removeBallByType(pitchType) {
  balls = balls.filter(ball => {
  balls = balls.filter(ball => {
    if (ball.userData.type === pitchType) {
    if (ball.userData.type === pitchType) {
      scene.remove(ball);
      scene.remove(ball);
      return false;
      return false;
    }
    }
    return true;
    return true;
  });
  });
}
}
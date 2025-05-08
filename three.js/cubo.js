import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const derechos = [
  "Derecho a la educación inclusiva",
  "Derecho a la accesibilidad universal",
  "Derecho a la libertad de expresión y opinión",
  "Derecho a vivir de forma independiente",
  "Derecho a la salud integral"
];

const cubos = [];
const boxGeometry = new THREE.BoxGeometry(3, 3, 1);

// Crear cubos con derechos
derechos.forEach((texto, i) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '18px sans-serif';
  ctx.fillText(texto, 10, 64);
  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(boxGeometry, material);
  mesh.position.x = (i - 2) * 4.5;
  cubos.push(mesh);
  scene.add(mesh);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubos);
  if (intersects.length > 0) {
    const index = cubos.indexOf(intersects[0].object);
    document.getElementById('infoBox').textContent = derechos[index];
  } else {
    document.getElementById('infoBox').textContent = 'Pasa el mouse sobre un cubo para leer un derecho.';
  }
});

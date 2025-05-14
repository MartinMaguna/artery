import * as THREE from 'three';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/loaders/OBJLoader.js';

let scene, camera, renderer;

function init() {
    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Cámara
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1, 3);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('sketch-container').appendChild(renderer.domElement);

    // Luz ambiental y direccional
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Cargar archivo OBJ
    const loader = new OBJLoader();
    loader.load(
        '/asset/reconstructed_base_shape.obj', // ruta relativa en el proyecto
        function (obj) {
            obj.scale.set(1, 1, 1);
            obj.position.set(0, 0, 0);
            scene.add(obj);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% cargado');
        },
        function (error) {
            console.error('Error al cargar el modelo OBJ:', error);
        }
    );

    animate();
}

// Animación
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();

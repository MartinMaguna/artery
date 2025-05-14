let scene, camera, renderer, model, mic, amplitude;
let smoothedLevel = 0;

init();
animate();

function init() {
  // Escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("sketch-container").appendChild(renderer.domElement);

  // Luz
  const ambientLight = new THREE.AmbientLight(0x666666);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Cargar modelo
  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('../posdata/fungarium-model/');
  mtlLoader.load('mushroom-2.mtl', function (materials) {
    materials.preload();
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('/asset/');
    objLoader.load('/posdata/fungarium-model/mushroom-2.obj', function (object) {
      object.scale.set(1, 1, 1);
      scene.add(object);
      model = object;
    });
  });

  // Audio
  mic = new p5.AudioIn();
  mic.start();
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  // Resize responsive
  window.addEventListener('resize', onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    let level = amplitude.getLevel();
    smoothedLevel = lerp(smoothedLevel, level, 0.1);

    let scale = map(smoothedLevel, 0, 0.3, 1, 3);
    model.scale.set(scale, scale, scale);

    model.rotation.y += 0.005;
    model.rotation.x += 0.002;

    let color = new THREE.Color(`hsl(${Math.floor(smoothedLevel * 300)}, 100%, 50%)`);
    model.traverse(child => {
      if (child.isMesh) child.material.color = color;
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

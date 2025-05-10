let model3D;
let mic, fft, amplitude;
let zoom = 0;
let rotation = { x: 0, y: 0 };
let smoothedLevel = 0;

function preload() {
  model3D = loadModel('../asset/usdz.obj', true); // Asegúrate de que la ruta sea válida
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('sketch-container');

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  noStroke();
}

function draw() {
  background(10);
  orbitControl(1, 1, 0.05); // Control de cámara con mouse (mejor que mapear manualmente)

  // Luz ambiente y direccional
  ambientLight(60);
  directionalLight(255, 255, 255, 0, -1, -1);

  // Nivel de audio para escala y color
  let level = amplitude.getLevel();
  smoothedLevel = lerp(smoothedLevel, level, 0.1); // suaviza la reactividad
  let scaleFactor = map(smoothedLevel, 0, 0.3, 1, 3);

  // FFT para variaciones extras si se desea
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");

  push();

  // Zoom desde mouseWheel
  translate(0, 0, zoom);

  // Escalado reactivo
  scale(scaleFactor);

  // Material reactivo al sonido
  let r = 200 - smoothedLevel * 200;
  let g = 100 + smoothedLevel * 155;
  let b = 150 + smoothedLevel * 50;
  ambientMaterial(r, g, b);

  // Rotación constante + mouseX / mouseY
  rotateX(rotation.x + frameCount * 0.001);
  rotateY(rotation.y + frameCount * 0.001);

  model(model3D);

  pop();
}

function mouseWheel(event) {
  zoom += event.delta * 0.2;
  zoom = constrain(zoom, -1000, 1000);
}

function mouseMoved() {
  // Rotación sensible al mouse, opcional si no se usa orbitControl
  rotation.x = map(mouseY, 0, height, -PI / 4, PI / 4);
  rotation.y = map(mouseX, 0, width, -PI, PI);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

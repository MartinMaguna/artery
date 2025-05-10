let model3D;
let mic, fft;
let amplitude;
let angle = 0;

function preload() {
  // Carga el modelo GLB
  model3D = loadModel('../assets/scene.obj', true);
}

function setup() {
  let canvas = createCanvas(800, 600, WEBGL);
  canvas.parent('sketch-container');

  // Iniciar micrófono
  mic = new p5.AudioIn();
  mic.start();

  // Crear FFT (Fast Fourier Transform) para análisis de audio
  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  noStroke();
}

function draw() {
  background(0);

  // Luz direccional para resaltar el modelo
  directionalLight(255, 255, 255, 0.5, 1, -0.5);
  ambientLight(60, 60, 60);

  // Obtener nivel de amplitud del sonido (entre 0 y 1)
  let level = amplitude.getLevel();
  let scaleFactor = map(level, 0, 0.3, 1, 3); // Ajustar escala reactiva

  rotateY(angle);
  rotateX(angle * 0.3);
  scale(scaleFactor);

  ambientMaterial(255 - level * 255, 100 + level * 100, 150 + level * 50);

  model(model3D);

  angle += 0.01;
}

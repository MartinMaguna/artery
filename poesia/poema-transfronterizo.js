let audioBase, amp, espinaImg;

function preload() {
  soundFormats('mp3');
  audioBase = loadSound('../asset/poeticastransfronterizas.mp3');
  espinaImg = loadImage('../asset/espinadorsal.jpg');
}

function setup() {
  noCanvas();
  amp = new p5.Amplitude();
  audioBase.loop();
  audioBase.setVolume(0.6);
  createImageTexture();
}

// === Crear textura dinámica para Hydra ===
function createImageTexture() {
  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = espinaImg.width;
  imgCanvas.height = espinaImg.height;
  const ctx = imgCanvas.getContext("2d");
  ctx.drawImage(espinaImg.canvas, 0, 0);
  s0.init({ src: imgCanvas, dynamic: true });
}

// === Configurar Hydra ===
const hydra = new Hydra({
  detectAudio: false,
  canvas: document.createElement("canvas"),
  enableStreamCapture: false
});

const hydraContainer = document.getElementById("sketch-container");
Object.assign(hydraContainer.style, {
  position: "relative",
  width: "100vw",
  height: "100vh"
});
Object.assign(hydra.canvas.style, {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
});
hydraContainer.appendChild(hydra.canvas);

// === Crear capas visuales ===
img = new Image();
img.src = '../asset/espinadorsal.jpg';
img.onload = () => {
  s0.init({ src: img, dynamic: true });

  // === o0: Imagen base con modulaciones suaves ===
  src(s0)
    .saturate(3)
    .contrast(0.5)
    .modulate(noise(0.3, 0.1), 0.02)
    .luma(0.3)
    .out(o0);
  // === o1: Efecto de distorsión y color ===
  src(o0)
    .saturate(3)
    .contrast(0.7)
    .modulate(noise(0.3, 0.1), 0.02)
    .luma(0.3)
    .modulateRotate(osc(10, 0.1, 1), 0.2)
    .modulateScale(osc(10, 0.1, 1), 0.2)
    .modulateHue(osc(10, 0.1, 1), 0.2)
    .modulate(osc(10, 0.1, 1), 0.2)
    .out(o1);


    render(o1);
};

speed = 0.1;

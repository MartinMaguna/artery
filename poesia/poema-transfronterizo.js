// poema-transfronterizo.js

let mapImg;
let audio;
let versosData;
let hotspots = [];
let flows = [];

function preload() {
  // Carga del audio
  audio = loadSound('poeticastransfronterizas.mp3');
  // Carga de los versos desde JSON
  versosData = loadJSON('poema-transfronterizo.json');
}

function setup() {
  // Crear canvas dentro del contenedor
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');

  // Iniciar audio en bucle
  if (audio && !audio.isPlaying()) {
    audio.loop();
  }

  textFont('Arial');
  textLeading(24);

  // Generar hotspots para cada verso en posiciones aleatorias
  versosData.versos.forEach(texto => {
    hotspots.push({
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.1, height * 0.9),
      texto: texto
    });
  });

  // Generar partículas de flujo de datos
  for (let i = 0; i < 150; i++) {
    let start = createVector(random(width), random(height));
    let end = createVector(random(width), random(height));
    flows.push({ pos: start.copy(), start, end, t: random(), speed: random(0.001, 0.005) });
  }
}

function draw() {
  background(0);
  // Dibuja el mapa como fondo
  image(mapImg, 0, 0, width, height);

  // Animar y dibujar partículas de migración
  noStroke();
  flows.forEach(f => {
    f.t += f.speed;
    if (f.t >= 1) {
      f.start = f.end.copy();
      f.end = createVector(random(width), random(height));
      f.t = 0;
    }
    // Interpolación suave
    let pos = p5.Vector.lerp(f.start, f.end, easeInOutQuad(f.t));
    fill(255, 150);
    ellipse(pos.x, pos.y, 6);
  });

  // Detección de hotspots y mostrar versos al acercar el mouse
  hotspots.forEach(h => {
    if (dist(mouseX, mouseY, h.x, h.y) < 30) {
      drawVerse(h);
    }
  });
}

function drawVerse(hotspot) {
  const padding = 10;
  const maxWidth = width * 0.5;
  textSize(18);
  textAlign(LEFT, TOP);
  // Caja de fondo semitransparente
  const lines = hotspot.texto.split('\n');
  const lineHeight = textLeading();
  const boxHeight = lines.length * lineHeight + padding * 2;
  const boxWidth = maxWidth;
  fill(0, 150);
  rect(hotspot.x + padding, hotspot.y + padding, boxWidth, boxHeight, 8);
  fill(255);
  lines.forEach((line, i) => {
    text(line, hotspot.x + padding * 2, hotspot.y + padding * 2 + i * lineHeight, maxWidth);
  });
}

// Easing para interpolación suave
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Ajustar canvas al cambiar tamaño de ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

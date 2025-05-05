let video, audio, fuente;
let shaderDisplace;
let versoIndex = 0;
let versos = [
  "Reforma Agrária", "É palavra", "Que dói na alma", "Que grita na calma",
  "De quem", "Não se levanta", "Reforma Agrária", "É bandeira", "Que clama",
  "Revolta", "E apenas reclama", "“na lei ou na marra”", "Com uma palavra:", "Terra!"
];
let tiempoUltimoVerso = 0;
let intervaloVerso = 3000; // tiempo entre versos en ms

// Shader para glitch de color
const displaceColorsSrc = `
precision highp float;

uniform sampler2D tex0;
varying vec2 vTexCoord;

vec2 zoom(vec2 coord, float amount) {
  vec2 relativeToCenter = coord - 0.5;
  relativeToCenter /= amount;
  return relativeToCenter + 0.5;
}

void main() {
  gl_FragColor = vec4(
    texture2D(tex0, vTexCoord).r,
    texture2D(tex0, zoom(vTexCoord, 1.05)).g,
    texture2D(tex0, zoom(vTexCoord, 1.1)).b,
    texture2D(tex0, vTexCoord).a
  );
}
`;

function preload() {
  video = createVideo(['../asset/videosintierra.mp4']);
  audio = loadSound('../asset/voz_poesiasintierra.mp3');

  // Fuente opcional
  fuente = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.elt.getContext('webgl', { willReadFrequently: true });

  video.hide();
  video.loop();
  video.volume(0);

  shaderDisplace = createFilterShader(displaceColorsSrc);

  if (!audio.isPlaying()) {
    audio.play();
  }

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  if (fuente) {
    textFont(fuente);
  }
}

function draw() {
  background(0);

  // Mostrar video con shader glitch aplicado
  push();
  imageMode(CENTER);
  image(video, 0, 0, width, height);
  filter(shaderDisplace);
  pop();

  // Mostrar versos uno a uno
  let tiempoActual = millis();
  if (tiempoActual - tiempoUltimoVerso > intervaloVerso && versoIndex < versos.length) {
    versoIndex++;
    tiempoUltimoVerso = tiempoActual;
  }

  push();
  fill(255);
  textSize(36);
  if (fuente) {
    textFont(fuente);
  }

  for (let i = 0; i < versoIndex; i++) {
    text(versos[i], 0, -height / 3 + i * 40);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

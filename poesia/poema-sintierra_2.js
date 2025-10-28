let videos = [ 
  '../asset/fervor/fervor01.webm',
  '../asset/fervor/fervor02.webm',
  '../asset/fervor/fervor03.webm',
  '../asset/fervor/fervor04.webm',
  '../asset/fervor/fervor05.webm'
];

let shuffledVideos = []; // lista mezclada
let currentVideoIndex = 0;
let video, audio;
let shaderDisplace;

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

// Mezcla aleatoriamente el arreglo de videos
function shuffleVideos() {
  shuffledVideos = shuffle(videos.slice());
  currentVideoIndex = 0;
}

function preload() {
  shuffleVideos();
  video = createVideo([shuffledVideos[currentVideoIndex]]);
  audio = loadSound('../asset/poesiasintierra-tati.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('sketch-container');
  canvas.elt.getContext('webgl', { willReadFrequently: true });

  video.hide();
  video.volume(0);
  video.onended(nextVideo);
  video.play(); // reproducir solo una vez, no en loop

  shaderDisplace = createFilterShader(displaceColorsSrc);

  if (!audio.isPlaying()) {
    audio.play();
  }
}

function draw() {
  background(0);
  push();
  imageMode(CENTER);
  image(video, 0, 0, width, height);
  filter(shaderDisplace);
  pop();
}

function nextVideo() {
  currentVideoIndex++;

  // Si se terminó la lista, volver a mezclar
  if (currentVideoIndex >= shuffledVideos.length) {
    shuffleVideos();
  }

  // Cargar el siguiente video
  video.remove();
  video = createVideo([shuffledVideos[currentVideoIndex]]);
  video.hide();
  video.volume(0);
  video.onended(nextVideo);
  video.play(); // reproducir una sola vez
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

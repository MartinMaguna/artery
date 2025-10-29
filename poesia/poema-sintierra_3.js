let videos = [
  '../asset/maos/maos01.webm',
  '../asset/maos/maos02.webm',
  '../asset/maos/maos03.webm',
  '../asset/maos/maos04.webm',
  '../asset/maos/maos05.webm',
  '../asset/maos/maos06.webm',
  '../asset/maos/maos07.webm',
  '../asset/maos/maos08.webm',
  '../asset/maos/maos09.webm'
];

let shuffledVideos = [];
let videosElements = [];
let currentVideoIndex = 0;
let lastChangeTime = 0;
const changeInterval = 10000; // 10 segundos

let audioJandi;
let shaderDisplace;

// Shader de glitch
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

// Mezcla los videos
function shuffleVideos() {
  shuffledVideos = shuffle(videos.slice());
}

// Precarga todos los videos
function preload() {
  shuffleVideos();

  for (let path of shuffledVideos) {
    let v = createVideo([path]);
    v.hide();
    v.volume(0);
    v.elt.preload = "auto"; // fuerza a que se cargue el video
    videosElements.push(v);
  }

  audioJandi = loadSound('../asset/jandi-poesiasintierra-02.m4a');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('sketch-container');

  shaderDisplace = createFilterShader(displaceColorsSrc);

  videosElements[0].play();

  if (!audioJandi.isPlaying()) {
    audioJandi.loop();
    audioJandi.setVolume(0.7);
  }
}

function draw() {
  background(0);

  // Cambiar video cada X segundos
  if (millis() - lastChangeTime > changeInterval) {
    lastChangeTime = millis();
    changeVideo();
  }

  push();
  imageMode(CENTER);
  image(videosElements[currentVideoIndex], 0, 0, width, height);
  filter(shaderDisplace);
  pop();
}

function changeVideo() {
  // Pausa el video actual
  videosElements[currentVideoIndex].pause();

  // Cambia al siguiente
  currentVideoIndex = (currentVideoIndex + 1) % videosElements.length;

  // Reproduce el siguiente
  videosElements[currentVideoIndex].play();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

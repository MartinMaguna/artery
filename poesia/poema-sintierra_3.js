let video;
let audioJandi;
let shaderDisplace;

const videos = [
  '../asset/maos/maos01.mp4',
  '../asset/maos/maos02.mp4',
  '../asset/maos/maos03.mp4',
  '../asset/maos/maos04.mp4',
  '../asset/maos/maos05.mp4',
  '../asset/maos/maos06.mp4',
  '../asset/maos/maos07.mp4',
  '../asset/maos/maos08.mp4',
  '../asset/maos/maos09.mp4'
];

let shuffledVideos = [];
let currentVideoIndex = 0;
let lastChangeTime = 0;
const changeInterval = 10000; // 10 segundos

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
  currentVideoIndex = 0;
}

function preload() {
  shuffleVideos();
  video = createVideo([shuffledVideos[currentVideoIndex]]);
  video.hide();
  audioJandi = loadSound('../asset/jandi-poesiasintierra-02.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('sketch-container');

  shaderDisplace = createFilterShader(displaceColorsSrc);

  video.volume(0);
  video.play();

  if (!audioJandi.isPlaying()) {
    audioJandi.loop();
  }
  audioJandi.setVolume(0.7);
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
  image(video, 0, 0, width, height);
  filter(shaderDisplace);
  pop();
}

function changeVideo() {
  video.stop();
  video.remove();

  currentVideoIndex++;

  // Si se terminó la lista, volver a mezclar
  if (currentVideoIndex >= shuffledVideos.length) {
    shuffleVideos();
  }

  video = createVideo([shuffledVideos[currentVideoIndex]]);
  video.hide();
  video.volume(0);
  video.play();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

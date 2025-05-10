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

function preload() {
  video = createVideo(['../asset/videosintierra.mp4']);
  audio = loadSound('../asset/jandi-poesiasintierra-insurgentes.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('sketch-container');
  canvas.elt.getContext('webgl', { willReadFrequently: true });

  video.hide();
  video.loop();
  video.volume(0);

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

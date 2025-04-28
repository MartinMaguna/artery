// poema-criptograma-p5.js

let img;
let verses = [
  "Por respeto y dignidad, exigimos prioridad.",
  "Que nuestra voz resuene fuerte, sin parcialidad.",
  "Nada de silencios más, basta de oscuridad.",
  "Cada palabra consciente, con igualdad.",
  "Merecemos espacio pleno en la realidad.",
  "No más puertas cerradas, ni marginalidad.",
  "Que el respeto sea norma, sin ambigüedad.",
  "La dignidad florece en la autenticidad.",
  "Construyamos puentes firmes, no hostilidad.",
  "Por respeto y dignidad, proclamamos nuestra verdad."
];
let currentVerse = 0;
let alpha = 255;
let fadingOut = false;
let fadingIn = false;

function preload() {
  // Carga tu foto de Criptograma
  img = loadImage('/asset/criptograma_photo.jpg');
}

function setup() {
  const container = select('#sketch-container');
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(container);

  textAlign(CENTER, CENTER);
  textSize(28);
  noStroke();
}

function draw() {
  background(0);

  // Imagen con "vibración"
  push();
    tint(255, 180);
    imageMode(CENTER);
    image(
      img,
      width / 2 + random(-4, 4),
      height / 2 + random(-4, 4),
      width,
      height
    );
  pop();

  // Líneas generativas
  noFill();
  stroke(255, 50);
  strokeWeight(1.5);
  for (let i = 0; i < 6; i++) {
    let angle = frameCount * 0.01 + i * TWO_PI / 6;
    let radius = map(sin(frameCount * 0.004 + i), -1, 1, 150, width / 3);
    let x = width / 2 + cos(angle) * radius;
    let y = height / 2 + sin(angle) * radius;
    ellipse(x, y, 100 + 20 * sin(frameCount * 0.02), 100 + 20 * cos(frameCount * 0.02));
  }

  // Texto con fade
  fill(255, alpha);
  text(
    verses[currentVerse],
    width / 2,
    height * 0.85,
    width * 0.8,
    200
  );

  if (fadingOut) {
    alpha -= 6;
    if (alpha <= 0) {
      alpha = 0;
      fadingOut = false;
      currentVerse = (currentVerse + 1) % verses.length;
      fadingIn = true;
    }
  } else if (fadingIn) {
    alpha += 6;
    if (alpha >= 255) {
      alpha = 255;
      fadingIn = false;
    }
  }
}

function mousePressed() {
  if (!fadingOut && !fadingIn) {
    fadingOut = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
let versos = [];
let index = 0;
let timer = 0;
let intervalo = 4000; // 4 segundos por verso

function preload() {
  loadJSON('poema-transfronterizo.json', (data) => {
    versos = data.versos;
  });
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");
  textFont('Georgia');
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
  noStroke();
  frameRate(30);
}

function draw() {
  background(0, 10); // efecto de fundido

  if (versos.length > 0) {
    fill(255);
    text(versos[index], width / 2, height / 2);
    if (millis() - timer > intervalo) {
      index = (index + 1) % versos.length;
      timer = millis();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

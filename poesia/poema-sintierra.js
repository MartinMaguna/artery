let osc;
let fft;
let playing = false;

function setup() {
  let cnv = createCanvas(400, 400);
  cnv.parent('canvas-container');
  textAlign(CENTER, CENTER);

  osc = new p5.Oscillator('sine');
  osc.amp(0);
  fft = new p5.FFT();
  noStroke();
}

function draw() {
  background(20);

  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");

  // Visualización: círculo que late
  let radius = map(bass, 0, 255, 50, 200);
  fill(255, 100);
  ellipse(width / 2, height / 2, radius, radius);

  // Visualización: pequeñas estrellas de datos
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let alpha = random(30, 100);
    stroke(255, alpha);
    point(x, y);
  }

  // Poema breve (puede ser opcional o sustituido por un audio luego)
  fill(200);
  textSize(14);
  text("latidos sin tierra,\nuna frecuencia en fuga", width / 2, height - 40);
}

function mousePressed() {
  if (!playing) {
    osc.start();
    osc.amp(0.2, 0.5);
    playing = true;
  } else {
    osc.stop();
    playing = false;
  }
}

function mouseMoved() {
  if (playing) {
    let freq = map(mouseX, 0, width, 100, 800);
    osc.freq(freq);
  }
}

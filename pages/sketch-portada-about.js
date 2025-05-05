let font, points = [];

function preload() {
    font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
  }
function setup() {
  const container = document.getElementById('sketchPortadaAbout');
  const canvas = createCanvas(container.offsetWidth, 500);
  canvas.parent('sketchPortadaAbout');

  noFill();
  stroke(255);
  strokeWeight(1);

  genType('A', width / 5);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let s = mouseY / 10 + sin(i * 0.25 + frameCount * 0.05) * 10;
    circle(p.x, p.y, s);
  }
}

function keyPressed() {
  genType(key.toUpperCase(), width / 5); // Podés cambiar la palabra desde teclado
}

function genType(txtString, txtSize) {
  let bounds = font.textBounds(txtString, 0, 0, txtSize);

  points = font.textToPoints(
    txtString,
    -bounds.w / 2,
    bounds.h / 2,
    txtSize,
    {
      sampleFactor: 0.1,
      simplifyThreshold: 0
    }
  );
}

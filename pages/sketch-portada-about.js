let font;
let letterPoints = [];
let interactionRadius = 45;
let canvas, isHovered = false;
let currentChar = 'A';

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  const container = document.getElementById('sketchPortadaAbout');
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(container);

  canvas.mouseOver(() => isHovered = true);
  canvas.mouseOut(() => isHovered = false);

  noFill();
  strokeWeight(1);

  generateLetter(currentChar, width / 3);
}

function windowResized() {
  const container = document.getElementById('sketchPortadaAbout');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
  generateLetter(currentChar, width / 3);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  for (let i = 0; i < letterPoints.length; i++) {
    const p = letterPoints[i];
    const osc = sin(i * 0.5 + frameCount * 0.1) * 1.5;
    fill(255, 80);
    noStroke();
    circle(p.x, p.y, 3 + osc);
  }

  stroke(255, 50);
  const hasTouch = touches.length > 0;
  const pointerX = hasTouch ? touches[0].x - width / 2 : mouseX - width / 2;
  const pointerY = hasTouch ? touches[0].y - height / 2 : mouseY - height / 2;

  if (isHovered || hasTouch) {
    for (let i = 0; i < letterPoints.length; i++) {
      for (let j = i + 1; j < letterPoints.length; j++) {
        const a = letterPoints[i];
        const b = letterPoints[j];
        const d = dist(a.x, a.y, b.x, b.y);

        if (d < interactionRadius) {
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const distToPointer = dist(midX, midY, pointerX, pointerY);
          const alpha = map(distToPointer, 0, 200, 120, 0);
          stroke(255, constrain(alpha, 0, 120));
          line(a.x, a.y, b.x, b.y);
        }
      }
    }
  }
}

function keyPressed() {
  const uppercase = key.toUpperCase();
  if (/^[A-Z]$/.test(uppercase)) {
    currentChar = uppercase;
    generateLetter(currentChar, width / 3);
  }
}

function generateLetter(character, size) {
  const bounds = font.textBounds(character, 0, 0, size);

  letterPoints = font.textToPoints(
    character,
    -bounds.w / 2,
    bounds.h / 2,
    size,
    {
      sampleFactor: 0.08,
      simplifyThreshold: 0
    }
  );
}

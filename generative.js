let ringCount = 200;
let segmentCount = 300;
let baseMaxRadius = 300;
let baseNoiseScale = 0.5;
let baseSwirlFactor = 0.1;
let zNoiseOffset = 0.02;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255, 255, 255, 40);
  strokeWeight(0.5);
  noFill();
}

function draw() {
  background(0, 10);

  // Valores interactivos mapeados al mouse o touch
  let interactiveX = mouseX || touches[0]?.x || width / 2;
  let interactiveY = mouseY || touches[0]?.y || height / 2;

  let noiseScale = baseNoiseScale + map(interactiveX, 0, width, 0, 1.0);
  let swirlFactor = baseSwirlFactor + map(interactiveY, 0, height, 0, 0.3);
  let maxRadius = baseMaxRadius + map(interactiveX + interactiveY, 0, width + height, -100, 100);

  for (let i = 0; i < ringCount - 1; i++) {
    beginShape();
    for (let j = 0; j < segmentCount; j++) {
      let angle = map(j, 0, segmentCount, 0, TWO_PI);
      let swirl = i * swirlFactor;
      let baseRadius = map(i, 0, ringCount - 1, 20, maxRadius);

      let n = noise(
        (cos(angle + swirl) + 1) * noiseScale,
        (sin(angle + swirl) + 1) * noiseScale,
        i * zNoiseOffset + t
      );

      let r = baseRadius + n * 100;
      let x = r * cos(angle + swirl);
      let y = r * sin(angle + swirl);
      vertex(x + width / 2, y + height / 2);
    }
    endShape(CLOSE);
  }

  t += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let ringCount = 200;
let segmentCount = 300;
let baseMaxRadius = 300;
let baseNoiseScale = 0.5;
let baseSwirlFactor = 0.1;
let zNoiseOffset = 0.02;
let t = 0;

let headerHeight = 0;
let footerHeight = 0;
let canvasHeight = 0;

function setup() {
  // Tomamos la altura real del header y footer
  headerHeight = document.querySelector('header')?.offsetHeight || 0;
  footerHeight = document.querySelector('footer')?.offsetHeight || 0;

  canvasHeight = windowHeight - headerHeight - footerHeight;

  let canvas = createCanvas(windowWidth, canvasHeight);
  canvas.parent('art-generativo');

  stroke(255, 255, 255, 40);
  strokeWeight(0.5);
  noFill();
}

function draw() {
  background(0, 10);

  // Centro relativo al canvas (que ahora tiene margen superior por el header)
  let centerX = width / 2;
  let centerY = height / 2;

  let interactiveX = mouseX || touches[0]?.x || centerX;
  let interactiveY = mouseY || touches[0]?.y || centerY;

  let noiseScale = baseNoiseScale + map(interactiveX, 0, width, 0, 1.0);
  let swirlFactor = baseSwirlFactor + map(interactiveY, 0, height, 0, 0.3);

  // Calculamos un radio máximo que asegure que no se sale del canvas
  let safeRadius = Math.min(width, height) * 0.45;

  let maxRadius = Math.min(baseMaxRadius + map(interactiveX + interactiveY, 0, width + height, -100, 100), safeRadius);

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
      vertex(x + centerX, y + centerY);
    }
    endShape(CLOSE);
  }

  t += 0.01;
}

function windowResized() {
  headerHeight = document.querySelector('header')?.offsetHeight || 0;
  footerHeight = document.querySelector('footer')?.offsetHeight || 0;
  canvasHeight = windowHeight - headerHeight - footerHeight;
  resizeCanvas(windowWidth, canvasHeight);
}

let nodes = [];
let nodeCount = 600;
let noiseScale = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  stroke(255, 30);
  noFill();

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      px: null,
      py: null,
      angle: random(TWO_PI),
      stepSize: random(0.5, 2),
      life: int(random(100, 300))
    });
  }
}

function draw() {
  for (let n of nodes) {
    if (n.life > 0) {
      let dx = mouseX - n.x;
      let dy = mouseY - n.y;
      let distToMouse = sqrt(dx * dx + dy * dy);

      // Aumentamos el área de influencia y la fuerza
      let force = constrain(300 / distToMouse, -10, 10);

      let noiseAngle = noise(n.x * noiseScale, n.y * noiseScale) * TWO_PI * 4;

      // Mayor impacto del mouse sobre la dirección
      let angle = noiseAngle + force * 0.2;

      n.px = n.x;
      n.py = n.y;
      n.x += cos(angle) * n.stepSize;
      n.y += sin(angle) * n.stepSize;

      // Línea más gruesa cerca del mouse para hacerlo más notorio
      let sw = map(distToMouse, 0, 200, 1.5, 0.2, true);
      strokeWeight(sw);
      stroke(255, 50);
      line(n.px, n.py, n.x, n.y);

      n.life--;

      if (n.x < 0 || n.x > width || n.y < 0 || n.y > height) {
        n.x = random(width);
        n.y = random(height);
        n.life = int(random(100, 300));
      }
    }
  }
}

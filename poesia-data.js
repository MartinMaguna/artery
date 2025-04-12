// 🎨 P5.js - Visuales basados en datos simulados

let dataPoints = [];
let numPoints = 100;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvas-container");

  noStroke();
  for (let i = 0; i < numPoints; i++) {
    dataPoints.push({
      x: random(width),
      y: random(height),
      size: random(5, 30),
      speed: random(0.5, 2)
    });
  }

  // 🔊 Strudel - sonido rítmico algorítmico
  const s = new Strudel();
  s.start().then(() => {
    s.tempo(90);
    s.pattern("bd [sn bd] ~ [hh*4 ~]");

    // 🌌 Hydra - visual generativo
    const hydra = new Hydra({ detectAudio: false });
    osc(10, 0.05, 1.5)
      .rotate(() => time * 0.1)
      .kaleid(3)
      .modulate(noise(3), 0.3)
      .colorama(0.3)
      .out();
  });
}

function draw() {
  clear();

  fill(0, 255, 255, 100);
  for (let pt of dataPoints) {
    ellipse(pt.x, pt.y, pt.size);
    pt.y += pt.speed;
    if (pt.y > height) {
      pt.y = 0;
      pt.x = random(width);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

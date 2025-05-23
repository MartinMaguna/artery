function sketchPoema1(p) {
  let bgImage;

  p.preload = function () {
    bgImage = p.loadImage('../asset/poeticas_transfronterizas.png'); // misma imagen que Poema3
  };

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPoema1').offsetWidth;
    let canvas = p.createCanvas(containerWidth, 150);
    canvas.parent('sketchPoema1');
    p.background(0);
  };

  p.draw = function () {
    p.image(bgImage, 0, 0, p.width, p.height);
    p.noFill();
    p.stroke(255, 50);
    p.beginShape();
    for (let x = 0; x < p.width; x += 10) {
      let y = p.noise(x * 0.02, p.frameCount * 0.005) * p.height;
      p.vertex(x, y);
    }
    p.endShape();
  };
}

function sketchPoema2(p) {
  let chars = "CRIPTOGRAMA";
  let timer = 0;
  let interval = 30; // mayor valor = más lento

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPoema2').offsetWidth;
    let canvas = p.createCanvas(containerWidth, 150);
    canvas.parent('sketchPoema2');
    p.background(0);
    p.fill(255);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(0, 30);

    // Solo dibuja cada `interval` frames
    if (p.frameCount % interval === 0) {
      let char = chars.charAt(p.floor(p.random(chars.length)));
      p.text(char, p.random(p.width), p.random(p.height));
    }
  };
}

function sketchPoema3(p) {
  let stars = [];
  let bgImage;

  p.preload = function () {
    bgImage = p.loadImage('../asset/poesiasintierra_image.png');
  };

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPoema3').offsetWidth;
    let canvas = p.createCanvas(containerWidth, 150);
    canvas.parent('sketchPoema3');

    for (let i = 0; i < 100; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(1, 3),
        speed: p.random(0.1, 0.5)
      });
    }
  };

  p.draw = function () {
    p.image(bgImage, 0, 0, p.width, p.height);
  };
}

// Inicializar los tres sketches
new p5(sketchPoema1);
new p5(sketchPoema2);
new p5(sketchPoema3);

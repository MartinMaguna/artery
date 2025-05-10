function sketchPortadaEnsayos(p) {
  let palabraOriginal = "ENSAYOS";
  let palabraCodificada = "3N54Y05";
  let noiseOffset = 0;
  let showCodificada = false;

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPortadaEnsayos').offsetWidth;
    const canvasHeight = window.innerHeight;
    let canvas = p.createCanvas(containerWidth, canvasHeight);
    canvas.parent('sketchPortadaEnsayos');
    p.textFont('Courier New');
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(0);

    let palabra = palabraOriginal;
    let letras = palabraOriginal.split("");

    let textAreaWidth = p.width * 0.5;
    let marginLeft = (p.width - textAreaWidth) / 2;
    let letraWidth = textAreaWidth / letras.length;

    let textSize = Math.min(p.width, p.height) / 14;
    p.textSize(textSize);
    p.textAlign(p.CENTER, p.CENTER);
    p.rectMode(p.CENTER);

    let y = p.height * 0.35;
    let textHeight = textSize * 1.6;

    // Hover detection
    showCodificada =
      p.mouseX >= marginLeft &&
      p.mouseX <= marginLeft + textAreaWidth &&
      p.mouseY >= y - textHeight / 2 &&
      p.mouseY <= y + textHeight / 2;

    if (showCodificada) {
      palabra = palabraCodificada;
      letras = palabraCodificada.split("");
      drawOrganicBar(p, marginLeft, textAreaWidth, y, textHeight);
      p.fill(0);
    } else {
      p.fill(255);
    }

    for (let i = 0; i < letras.length; i++) {
      let x = marginLeft + i * letraWidth + letraWidth / 2;
      p.text(letras[i], x, y);
    }

    noiseOffset += 0.01;
  };

  function drawOrganicBar(p, x, w, y, h) {
    p.noStroke();
    p.fill(255);

    let segments = 100;
    let top = [];
    let bottom = [];

    for (let i = 0; i <= segments; i++) {
      let px = x + (w * i) / segments;
      let n = p.noise(i * 0.1, noiseOffset) * 15;
      top.push([px, y - h / 2 - n]);
      bottom.push([px, y + h / 2 + n]);
    }

    p.beginShape();
    for (let i = 0; i < top.length; i++) {
      p.vertex(top[i][0], top[i][1]);
    }
    for (let i = bottom.length - 1; i >= 0; i--) {
      p.vertex(bottom[i][0], bottom[i][1]);
    }
    p.endShape(p.CLOSE);
  }

  p.windowResized = function () {
    const containerWidth = document.getElementById('sketchPortadaEnsayos').offsetWidth;
    const canvasHeight = window.innerHeight;
    p.resizeCanvas(containerWidth, canvasHeight);
  };
}

new p5(sketchPortadaEnsayos);

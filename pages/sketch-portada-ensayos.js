function sketchPortadaEnsayos(p) {
  let palabraOriginal = "ENSAYOS";
  let palabraCodificada = "3N54Y05";
  let hover = false;

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPortadaEnsayos').offsetWidth;
    const canvasHeight = window.innerHeight; // O por ejemplo: window.innerHeight * 0.8;
    let canvas = p.createCanvas(containerWidth, canvasHeight);
    canvas.parent('sketchPortadaEnsayos');
    p.textFont('Courier New'); // o 'monospace'
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(0);
    hover = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
    let palabra = hover ? palabraCodificada : palabraOriginal;
    let letras = palabra.split("");
    let letraWidth = p.width / letras.length;

    for (let i = 0; i < letras.length; i++) {
      let x = i * letraWidth + letraWidth / 2;
      let y = p.height / 2;

      if (hover) {
        p.fill(255);
        p.rectMode(p.CENTER);
        p.rect(x, y, letraWidth - 10, 100, 10);
        p.fill(0);
      } else {
        p.fill(255);
      }

      p.textSize(Math.min(p.width, p.height) / 10); // se adapta al tamaño del viewport
      p.text(letras[i], x, y);
    }
  };

  p.windowResized = function () {
    const containerWidth = document.getElementById('sketchPortadaEnsayos').offsetWidth;
    const canvasHeight = window.innerHeight;
    p.resizeCanvas(containerWidth, canvasHeight);
  };
}

new p5(sketchPortadaEnsayos);

function sketchPortadaEnsayos(p) {
  let palabraOriginal = "ENSAYOS";
  let palabraCodificada = "3N54Y05";
  let hover = false;

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
  
    // Detectar si el mouse está sobre el área del texto
    if (
      p.mouseX >= marginLeft &&
      p.mouseX <= marginLeft + textAreaWidth &&
      p.mouseY >= y - textHeight / 2 &&
      p.mouseY <= y + textHeight / 2
    ) {
      palabra = palabraCodificada;
      letras = palabraCodificada.split("");
    }
  
    for (let i = 0; i < letras.length; i++) {
      let x = marginLeft + i * letraWidth + letraWidth / 2;
  
      if (palabra === palabraCodificada) {
        p.fill(255);
        p.rect(x, y, letraWidth - 10, textHeight, 10);
        p.fill(0);
      } else {
        p.fill(255);
      }
  
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

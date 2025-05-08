function sketchPortadaPoesia(p) {
  let chars = "P0ES1A";
  let letters = [];
  let frameInterval = 15; // más lento
  let arrowY = 440;
  let arrowDirection = 1;

  p.setup = function () {

    const containerWidth = document.getElementById('sketchPortadaPoesia').offsetWidth;
    const containerHeight = document.getElementById('sketchPortadaPoesia').offsetHeight;
    let canvas = p.createCanvas(containerWidth, containerHeight);

    canvas.parent('sketchPortadaPoesia');
    p.background(0);
    p.textSize(24);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();
  };

  p.draw = function () {
    // Fondo semitransparente para no borrar completamente
    p.fill(0, 30);
    p.rect(0, 0, p.width, p.height);

    // Agregar una nueva letra cada cierto tiempo
    if (p.frameCount % frameInterval === 0) {
      let char = chars.charAt(p.floor(p.random(chars.length)));
      letters.push({
        char: char,
        x: p.random(p.width),
        y: p.random(p.height),
        life: 255 // opacidad inicial
      });
    }

    // Dibujar letras y disminuir opacidad
    for (let i = letters.length - 1; i >= 0; i--) {
      let l = letters[i];
      p.fill(255, l.life);
      p.text(l.char, l.x, l.y);
      l.life -= 8; // velocidad de desvanecimiento

      if (l.life < 0) {
        letters.splice(i, 1);
      }
    }


// Indicador de scroll: flecha ligeramente más visible y elegante
p.push();
p.stroke(255, 120); // blanco con mayor opacidad
p.strokeWeight(1.2); // grosor intermedio (ligeramente más visible)
p.noFill();
p.translate(p.width / 2, arrowY);

let arrowSize = 8; // tamaño más grande para mayor visibilidad
p.line(-arrowSize, -arrowSize, 0, 0); // línea izquierda
p.line(arrowSize, -arrowSize, 0, 0);  // línea derecha
p.pop();

// Animación sutil de rebote
arrowY += arrowDirection * 0.2; // movimiento suave
if (arrowY > 458 || arrowY < 442) {
  arrowDirection *= -1; // cambio de dirección al llegar a los límites
}

  };
}

new p5(sketchPortadaPoesia);

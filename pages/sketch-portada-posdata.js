function sketchPortadaPosdata(p) {
  let particles = [];
  let maxParticles = 300;
  let connectDist = 50;
  let arrowY = 440; // Posición inicial de la flecha
  let arrowDirection = 1; // Dirección del movimiento de la flecha

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPortadaPosdata').offsetWidth;
    let canvas = p.createCanvas(containerWidth, 500);
    canvas.parent('sketchPortadaPosdata');
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();
    p.background(0); // Fondo completamente negro
  };

  p.draw = function () {
    p.background(0); // Limpia todo, sin estelas

    // Crear nuevas partículas
    if (p.frameCount % 3 === 0 && particles.length < maxParticles) {
      const distToMouse = p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2);
      const satNearMouse = p.map(distToMouse, 0, p.width / 2, 100, 30, true);

      particles.push({
        x: p.mouseX + p.random(-80, 80),
        y: p.mouseY + p.random(-80, 80),
        r: p.random(2, 5),
        hue: p.random(300, 340), // todo el espectro de colores
        sat: satNearMouse + p.random(-5, -4),
        bri: p.random(60, 100),
        alpha: p.random(70, 100),
        life: 200,
        vx: p.random(-0.6, 0.6),
        vy: p.random(-0.6, 0.6)
      });
    }

    // Dibujar partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      let pt = particles[i];

      p.fill(pt.hue, pt.sat, pt.bri, pt.alpha);
      p.ellipse(pt.x, pt.y, pt.r);

      pt.vx += p.sin(p.frameCount * 0.005 + i) * 0.01;
      pt.vy += p.cos(p.frameCount * 0.005 + i) * 0.01;
      pt.x += pt.vx;
      pt.y += pt.vy;

      pt.life -= 1;
      if (pt.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Dibujar conexiones entre partículas
    p.strokeWeight(1);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let a = particles[i];
        let b = particles[j];
        let d = p.dist(a.x, a.y, b.x, b.y);
        if (d < connectDist) {
          let alpha = p.map(d, 0, connectDist, 30, 0);
          p.stroke(a.hue, a.sat, a.bri, alpha);
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }

    // Dibujar la flecha de scroll (ajustada al estilo del Código 1)
    p.push();
    p.stroke(255, 120); // Opacidad más alta para la flecha (similar al Código 1)
    p.strokeWeight(1.2); // Grosor intermedio (similar al Código 1)
    p.noFill();
    p.translate(p.width / 2, arrowY);

    let arrowSize = 8; // Tamaño más grande para mayor visibilidad
    p.line(-arrowSize, -arrowSize, 0, 0); // Línea izquierda
    p.line(arrowSize, -arrowSize, 0, 0);  // Línea derecha
    p.pop();

    // Animación sutil de rebote
    arrowY += arrowDirection * 0.2; // Movimiento suave
    if (arrowY > 458 || arrowY < 442) {
      arrowDirection *= -1; // Cambio de dirección al llegar a los límites
    }

    p.noStroke();
  };
}

new p5(sketchPortadaPosdata);

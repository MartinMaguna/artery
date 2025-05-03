function sketchPortadaPosdata(p) {
  let particles = [];
  let maxParticles = 300;
  let connectDist = 50;
  let arrowY = 440;
  let arrowDirection = 1;
  let lastMouseMove = 0;

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPortadaPosdata').offsetWidth;
    let canvas = p.createCanvas(containerWidth, 500);
    canvas.parent('sketchPortadaPosdata');
    p.colorMode(p.RGB, 255);
    p.noCursor();
  };

  p.draw = function () {
    p.background(0);

    // Crear nuevas partículas cerca del cursor
    if (p.frameCount - lastMouseMove > 20 && particles.length < maxParticles) {
      const distToMouse = p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2);
      const brightnessNearMouse = p.map(distToMouse, 0, p.width / 2, 255, 180, true);

      particles.push({
        x: p.mouseX + p.random(-80, 80),
        y: p.mouseY + p.random(-80, 80),
        r: p.random(3, 7),
        brightness: brightnessNearMouse + p.random(-10, 10),
        alpha: p.random(100, 200),
        life: 200,
        vx: p.random(-0.2, 0.2),
        vy: p.random(-0.2, 0.2)
      });

      lastMouseMove = p.frameCount;
    }

    // Agregar el cursor como una partícula más (no se agota)
    const cursorParticle = {
      x: p.mouseX,
      y: p.mouseY,
      r: 6,
      brightness: 255,
      alpha: 255
    };

    // Dibujar partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      let pt = particles[i];
      const distToMouse = p.dist(pt.x, pt.y, p.mouseX, p.mouseY);
      pt.brightness = p.map(distToMouse, 0, p.width / 2, 255, 180, true);

      p.fill(pt.brightness, pt.brightness, pt.brightness, pt.alpha);
      p.ellipse(pt.x, pt.y, pt.r);

      pt.vx += p.sin(p.frameCount * 0.005 + i) * 0.005;
      pt.vy += p.cos(p.frameCount * 0.005 + i) * 0.005;
      pt.x += pt.vx;
      pt.y += pt.vy;

      pt.life -= 1;
      if (pt.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Agregar cursor a la lista temporal para conexiones
    let allParticles = [...particles, cursorParticle];

    // Dibujar conexiones expandidas y más visibles
    p.strokeWeight(2);
    let expandedConnectDist = p.map(p.frameCount, 0, 300, 50, 150);

    for (let i = 0; i < allParticles.length; i++) {
      for (let j = i + 1; j < allParticles.length; j++) {
        let a = allParticles[i];
        let b = allParticles[j];
        let d = p.dist(a.x, a.y, b.x, b.y);

        if (d < expandedConnectDist) {
          let alpha = p.map(d, 0, expandedConnectDist, 50, 0);
          p.stroke(255, alpha);
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }

    // Dibujar el cursor como un círculo brillante con halo pulsante
    let pulse = p.sin(p.frameCount * 0.1) * 2;
    p.noFill();
    p.stroke(255, 100);
    p.strokeWeight(2);
    p.ellipse(p.mouseX, p.mouseY, 30 + pulse, 30 + pulse); // halo

    p.fill(255);
    p.noStroke();
    p.ellipse(p.mouseX, p.mouseY, 8, 8); // centro sólido

    // Flecha de scroll
    p.push();
    p.stroke(255, 120);
    p.strokeWeight(1.2);
    p.noFill();
    p.translate(p.width / 2, arrowY);

    let arrowSize = 8;
    p.line(-arrowSize, -arrowSize, 0, 0);
    p.line(arrowSize, -arrowSize, 0, 0);
    p.pop();

    arrowY += arrowDirection * 0.2;
    if (arrowY > 458 || arrowY < 442) {
      arrowDirection *= -1;
    }
  };
}

new p5(sketchPortadaPosdata);

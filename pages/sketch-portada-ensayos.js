function sketchPortadaEnsayos(p) {
    let particles = [];
    let planetRadius = 150;
    let planetRotationX = 0;
    let planetRotationY = 0;
  
    p.setup = function () {
      const containerWidth = document.getElementById('sketchPortadaEnsayos').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 500, p.WEBGL);
      canvas.parent('sketchPortadaEnsayos');
      p.noStroke();
      p.frameRate(60);  // Animación fluida
  
      // Inicializar partículas en la esfera
      for (let lat = -p.PI / 2; lat < p.PI / 2; lat += 0.05) {
        for (let lon = -p.PI; lon < p.PI; lon += 0.1) {
          let x = planetRadius * p.cos(lat) * p.cos(lon);
          let y = planetRadius * p.cos(lat) * p.sin(lon);
          let z = planetRadius * p.sin(lat);
  
          // Crear una partícula en cada coordenada
          particles.push(new Particle(x, y, z));
        }
      }
    };
  
    p.draw = function () {
      p.background(0);
  
      // Actualizar la rotación con base en la posición del mouse
      planetRotationX = p.map(p.mouseY, 0, p.height, -p.PI, p.PI);
      planetRotationY = p.map(p.mouseX, 0, p.width, -p.PI, p.PI);
  
      // Aplicar la rotación
      p.push();
      p.rotateX(planetRotationX); // Rotación en el eje X
      p.rotateY(planetRotationY); // Rotación en el eje Y
  
      // Dibujar las partículas de la esfera
      for (let particle of particles) {
        particle.show();
      }
  
      p.pop(); // Fin de la rotación
    };
  
    // Clase para las partículas (simulando los puntos de la esfera)
    class Particle {
      constructor(x, y, z) {
        this.pos = p.createVector(x, y, z);
      }
  
      show() {
        p.push();
        p.translate(this.pos.x, this.pos.y, this.pos.z);
        p.fill(255); // Blanco para las partículas
        p.sphere(2); // Partícula representada por una esfera pequeña
        p.pop();
      }
    }
  }
  
  // Crear instancia de p5.js
  new p5(sketchPortadaEnsayos);
  
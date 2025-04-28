function sketchLSystem(p) {
    let axiom = "F";
    let sentence = axiom;
    let rules = [{ a: "F", b: "FF+[+F-F-F]-[-F+F+F]" }];
    let len = 80;
    let generation = 0;
    let maxGenerations = 6;
    let framesPerGeneration = 180; // Más lento: 3 segundos entre generaciones
    let lastGenerationFrame = 0;
  
    p.setup = function() {
      const containerWidth = document.getElementById('sketchLSystem').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 150);
      canvas.parent('sketchLSystem');
      p.background(0);
      p.stroke(255);
      p.translate(p.width/2, p.height);
      render();
    };
  
    p.draw = function() {
      if (generation < maxGenerations && p.frameCount - lastGenerationFrame > framesPerGeneration) {
        p.background(0);
        p.translate(p.width/2, p.height);
        generate();
        render();
        generation++;
        lastGenerationFrame = p.frameCount;
      }
    };
  
    function generate() {
      let nextSentence = "";
      for (let i = 0; i < sentence.length; i++) {
        let current = sentence.charAt(i);
        let found = false;
        for (let j = 0; j < rules.length; j++) {
          if (current == rules[j].a) {
            found = true;
            nextSentence += rules[j].b;
            break;
          }
        }
        if (!found) {
          nextSentence += current;
        }
      }
      sentence = nextSentence;
      len *= 0.5;
    }
  
    function render() {
      for (let i = 0; i < sentence.length; i++) {
        let current = sentence.charAt(i);
  
        if (current == "F") {
          p.line(0, 0, 0, -len);
          p.translate(0, -len);
        } else if (current == "+") {
          p.rotate(p.radians(25));
        } else if (current == "-") {
          p.rotate(p.radians(-25));
        } else if (current == "[") {
          p.push();
        } else if (current == "]") {
          p.pop();
        }
      }
    }
  }
  
  
  
  function sketchNoiseFlow(p) {
    p.setup = function() {
      const containerWidth = document.getElementById('sketchNoiseFlow').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 150);
      canvas.parent('sketchNoiseFlow');
      p.background(0);
    };
  
    p.draw = function() {
      p.noFill();
      p.stroke(255, 50);
      p.beginShape();
      for (let x = 0; x < p.width; x += 5) {
        let y = p.noise(x * 0.02, p.frameCount * 0.01) * p.height;
        p.vertex(x, y);
      }
      p.endShape();
      // Fondo traslúcido para "barrido" efecto tiempo
      p.fill(0, 5);
      p.rect(0, 0, p.width, p.height);
    };
  }
  
  
  function sketchRhizome(p) {
    let particles = [];
  
    p.setup = function() {
      const containerWidth = document.getElementById('sketchRhizome').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 150);
      canvas.parent('sketchRhizome');
      p.background(0);
      for (let i = 0; i < 50; i++) {
        particles.push({
          pos: p.createVector(p.random(p.width), p.random(p.height)),
          vel: p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5))
        });
      }
    };
  
    p.draw = function() {
      p.background(0, 20);
      p.stroke(255, 100);
      p.noFill();
      for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let d = p.dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
          if (d < 70) {
            p.strokeWeight(p.map(d, 0, 70, 1, 0));
            p.line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
          }
        }
      }
      particles.forEach(particle => {
        particle.pos.add(particle.vel);
        if (particle.pos.x < 0 || particle.pos.x > p.width) particle.vel.x *= -1;
        if (particle.pos.y < 0 || particle.pos.y > p.height) particle.vel.y *= -1;
      });
    };
  }
  
  
  // Inicializar cada sketch
  new p5(sketchLSystem);
  new p5(sketchNoiseFlow);
  new p5(sketchRhizome);
  
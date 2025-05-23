function sketchEnsayo1(p) {
    p.setup = function() {
      const containerWidth = document.getElementById('sketchEnsayo1').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 150);
      canvas.parent('sketchEnsayo1');
      p.background(0);
    };
  
    p.draw = function() {
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
  
  function sketchEnsayo2(p) {
    let chars = "ENSAYOS";
    
    p.setup = function() {
      const containerWidth = document.getElementById('sketchEnsayo2').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 150);
      canvas.parent('sketchEnsayo2');
      p.background(0);
      p.fill(255);
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
    };
  
    p.draw = function() {
      p.background(0, 30);
      let char = chars.charAt(p.floor(p.random(chars.length)));
      p.text(char, p.random(p.width), p.random(p.height));
    };
  }
  
  function sketchEnsayo3(p) {
    let stars = [];
  
    p.setup = function() {
      const containerWidth = document.getElementById('sketchEnsayo3').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 150);
      canvas.parent('sketchEnsayo3');
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: p.random(p.width),
          y: p.random(p.height),
          r: p.random(1, 3),
          speed: p.random(0.1, 0.5)
        });
      }
      p.background(0);
    };
  
    p.draw = function() {
      p.background(0, 20);
      p.noStroke();
      p.fill(255);
      for (let s of stars) {
        p.circle(s.x, s.y, s.r);
        s.y += s.speed;
        if (s.y > p.height) {
          s.y = 0;
          s.x = p.random(p.width);
        }
      }
    };
  }
  
  // Inicializar los tres sketches
  new p5(sketchEnsayo1);
  new p5(sketchEnsayo2);
  new p5(sketchEnsayo3);
  
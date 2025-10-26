// ==========================
// Sketch Portada Ensayos
// ==========================
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

      // Dibuja fondo blanco rasgado extendido a todo el ancho
      drawOrganicBarFullWidth(p, y, textHeight);

      p.fill(0); // letras negras sobre fondo blanco
    } else {
      p.fill(255); // letras blancas normales
    }

    // Dibujar letras
    for (let i = 0; i < letras.length; i++) {
      let x = marginLeft + i * letraWidth + letraWidth / 2;
      p.text(letras[i], x, y);
    }

    noiseOffset += 0.01;
  };

  // Nueva función: fondo blanco rasgado extendido a todo el ancho
  function drawOrganicBarFullWidth(p, y, h) {
    p.noStroke();
    p.fill(255);
    let segments = 150; // más segmentos para suavidad
    let top = [];
    let bottom = [];

    for (let i = 0; i <= segments; i++) {
      let px = (p.width * i) / segments; // cubrir todo el ancho
      let n = p.noise(i * 0.1, noiseOffset) * 25; // amplitud del rasgado
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



// ==========================
// Sketch Arte Electrónico - Torres García
// ==========================
function sketchTorresGarcia(p) {
  let cols = 40;
  let rows = 40;
  let grid = [];
  let palette = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557', '#f9c74f', '#f9844a'];
  let hover = false;
  let container;

  p.setup = function () {
    container = p.select('#torres-garcia-container');
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    let canvas = p.createCanvas(w, h);
    canvas.parent('torres-garcia-container');
    p.noStroke();
    p.pixelDensity(1);
    p.frameRate(15);
    generateGrid();
  };

  function generateGrid() {
    grid = [];
    for (let j = 0; j < rows; j++) {
      let row = [];
      for (let i = 0; i < cols; i++) {
        let val = p.floor(p.random(2));
        let col = p.random(palette);
        row.push({ val, col });
      }
      grid.push(row);
    }
  }

  p.draw = function () {
    p.background('#f1faee');
    let cellW = p.width / cols;
    let cellH = p.height / rows;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let x = i * cellW;
        let y = j * cellH;
        if (hover) {
          p.fill(grid[j][i].col);
        } else {
          p.fill(grid[j][i].val === 1 ? 0 : 255);
        }
        p.rect(x, y, cellW, cellH);
      }
    }
  };

  p.mouseMoved = function () {
    hover = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
  };

  p.windowResized = function () {
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    p.resizeCanvas(w, h);
    generateGrid();
  };
}
new p5(sketchTorresGarcia);


// ==========================
// Sketch Literatura Electrónica
// ==========================
function sketchLiteraturaElectronica(p) {
  let cols = 40;
  let rows = 40;
  let grid = [];
  let palette = ['#e63946', '#f9c74f', '#f9844a', '#a8dadc', '#457b9d', '#9a4eec', '#00b9e1'];
  let container;

  p.setup = function () {
    container = p.select('#literatura-electronica-container');
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    let canvas = p.createCanvas(w, h);
    canvas.parent('literatura-electronica-container');
    p.noStroke();
    p.pixelDensity(1);
    p.frameRate(30);
    generateGrid();
  };

  function generateGrid() {
    grid = [];
    for (let j = 0; j < rows; j++) {
      let row = [];
      for (let i = 0; i < cols; i++) {
        let val = p.floor(p.random(2));
        let col = p.random(palette);
        row.push({ val, col });
      }
      grid.push(row);
    }
  }

  p.draw = function () {
    p.fill(0, 40);
    p.rect(0, 0, p.width, p.height);
    let cellW = p.width / cols;
    let cellH = p.height / rows;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let x = i * cellW + cellW / 2;
        let y = j * cellH + cellH / 2;
        let d = p.dist(p.mouseX, p.mouseY, x, y);
        let nearCursor = d < 80;
        if (nearCursor) {
          p.fill(p.random(palette));
        } else {
          p.fill(255, p.random(100, 200));
        }
        if (p.random() < 0.02) grid[j][i].val = 1 - grid[j][i].val;
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(cellW * 0.6);
        p.text(grid[j][i].val === 1 ? "█" : ".", x, y);
      }
    }
  };

  p.windowResized = function () {
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    p.resizeCanvas(w, h);
    generateGrid();
  };
}
new p5(sketchLiteraturaElectronica);


// ==========================
// Sketch Cortar Pegar
// ==========================
function sketchCopiarPegar(p) {
  let cols = 40;
  let rows = 40;
  let grid = [];
  let palette = ['#e63946', '#f9c74f', '#f9844a', '#a8dadc', '#457b9d', '#9a4eec', '#00b9e1'];
  let container;
  let symbols = ['█', '.', '#', '%', '@', '&', '*', '¤', '∆', 'Ω', '♢', '♪'];

  p.setup = function () {
    container = p.select('#copiar-pegar-container');
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    let canvas = p.createCanvas(w, h);
    canvas.parent('copiar-pegar-container');
    p.noStroke();
    p.pixelDensity(1);
    p.frameRate(30);
    p.textFont('monospace');
    generateGrid();
  };

  function generateGrid() {
    grid = [];
    for (let j = 0; j < rows; j++) {
      let row = [];
      for (let i = 0; i < cols; i++) {
        row.push({
          val: p.floor(p.random(2)),   // 0 o 1
          col: p.random(palette),
          symbol: p.random(symbols)
        });
      }
      grid.push(row);
    }
  }

  p.draw = function () {
    // Fondo semitransparente para persistencia visual
    p.fill(0, 40);
    p.rect(0, 0, p.width, p.height);

    let cellW = p.width / cols;
    let cellH = p.height / rows;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let x = i * cellW + cellW / 2;
        let y = j * cellH + cellH / 2;
        let d = p.dist(p.mouseX, p.mouseY, x, y);
        let nearCursor = d < 80;

        if (nearCursor) {
          // Colores vivos cerca del cursor
          p.fill(p.random(palette));
        } else {
          // Símbolos blancos tenues, intermitentes
          p.fill(255, p.random(100, 200));
        }

        if (p.random() < 0.02) grid[j][i].val = 1 - grid[j][i].val;

        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(cellW * 0.6);
        p.text(grid[j][i].val === 1 ? grid[j][i].symbol : ".", x, y);
      }
    }
  };

  p.windowResized = function () {
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    p.resizeCanvas(w, h);
    generateGrid();
  };
}

new p5(sketchCopiarPegar);

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
    p.textFont('Roboto'); // tipografía Roboto
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
    // Fondo semitransparente
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

    // Rectángulo blanco centrado para el título
    let rectW = p.width * 0.2;
    let rectH = p.height * 0.1;
    let rectX = p.width / 2 - rectW / 2;
    let rectY = p.height * 0.4;
    p.fill(255);
    p.rect(rectX, rectY, rectW, rectH);

    // Texto del título
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(rectH * 0.6);
    p.text("Ctrl + Art", p.width / 2, rectY + rectH / 2);
  };

  p.windowResized = function () {
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    p.resizeCanvas(w, h);
    generateGrid();
  };
}

new p5(sketchCopiarPegar);

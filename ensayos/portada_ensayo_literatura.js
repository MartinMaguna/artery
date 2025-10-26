let cols = 40;
let rows = 40;
let grid = [];
let palette = ['#e63946', '#f9c74f', '#f9844a', '#a8dadc', '#457b9d', '#9a4eec', '#00b9e1'];
let container;

function setup() {
  container = select('#literatura-electronica-container');
  let w = container.elt.clientWidth;
  let h = container.elt.clientHeight || 300;
  let canvas = createCanvas(w, h);
  canvas.parent('literatura-electronica-container');
  noStroke();
  pixelDensity(1);
  frameRate(30);
  generateGrid();
}

function generateGrid() {
  grid = [];
  for (let j = 0; j < rows; j++) {
    let row = [];
    for (let i = 0; i < cols; i++) {
      let val = floor(random(2)); // 0 o 1
      let col = random(palette);
      row.push({ val, col });
    }
    grid.push(row);
  }
}

function draw() {
  // Fondo negro semitransparente para efecto de persistencia visual
  fill(0, 40);
  rect(0, 0, width, height);

  let cellW = width / cols;
  let cellH = height / rows;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * cellW + cellW / 2;
      let y = j * cellH + cellH / 2;

      // Distancia al cursor para detectar zona de color
      let d = dist(mouseX, mouseY, x, y);
      let nearCursor = d < 80;

      if (nearCursor) {
        // Zona cercana al cursor → colores vivos
        fill(random(palette));
      } else {
        // Fondo: letras blancas tenues, intermitentes
        fill(255, random(100, 200));
      }

      // Pequeñas variaciones de opacidad para efecto de vibración
      if (random() < 0.02) {
        grid[j][i].val = 1 - grid[j][i].val;
      }

      // En lugar de rectángulos, pequeños caracteres luminosos
      textAlign(CENTER, CENTER);
      textSize(cellW * 0.6);
      text(grid[j][i].val === 1 ? "█" : ".", x, y);
    }
  }
}

function windowResized() {
  let w = container.elt.clientWidth;
  let h = container.elt.clientHeight || 300;
  resizeCanvas(w, h);
  generateGrid();
}

/*
Obra interactiva: Bauhaus + Pixel Art
Autor: Martín Maguna
Descripción:
  - Composición geométrica modular con colores Bauhaus.
  - Inicialmente en blanco y negro; al pasar el cursor, se revela en colores.
  - Totalmente responsiva y animación más lenta.
*/

let cols = 40;
let rows = 40;
let grid = [];
let palette = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557', '#f9c74f', '#f9844a'];
let hover = false;
let container;

function setup() {
    container = select('#torres-garcia-container');
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300; // altura mínima si el contenedor está vacío
    let canvas = createCanvas(w, h);
    canvas.parent('torres-garcia-container');
    noStroke();
    pixelDensity(1);
    frameRate(15); // animación más lenta
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
    background('#f1faee');
    let cellW = width / cols;
    let cellH = height / rows;

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let x = i * cellW;
            let y = j * cellH;

            if (hover) {
                // Mostrar versión en colores al pasar el cursor
                fill(grid[j][i].col);
            } else {
                // Estado inicial: blanco y negro
                fill(grid[j][i].val === 1 ? 0 : 255);
            }
            rect(x, y, cellW, cellH);
        }
    }
}

function mouseMoved() {
    const withinX = mouseX >= 0 && mouseX <= width;
    const withinY = mouseY >= 0 && mouseY <= height;
    hover = withinX && withinY;
}

function windowResized() {
    let w = container.elt.clientWidth;
    let h = container.elt.clientHeight || 300;
    resizeCanvas(w, h);
    generateGrid();
}

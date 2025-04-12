
function setup() {
    // Crear un canvas que se adapte al contenedor
    const canvas = createCanvas(windowWidth, 400);
    canvas.parent('art-generativo');
    noLoop();
}

function draw() {
    background(240);
    // Ejemplo: dibujo aleatorio con líneas
    stroke(0);
    for (let i = 0; i < 10; i++) {
        line(random(width), random(height), random(width), random(height));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, 400);
}
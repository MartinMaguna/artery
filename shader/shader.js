// Fluido generativo reactivo - p5.js + WebGL + Shader
// Inspirado en seda, humo coloreado y marbling art

let theShader;
let fft, mic;

function preload() {
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
    let spectrum = fft.analyze();
    let bass = fft.getEnergy("bass") / 255.0;
    let treble = fft.getEnergy("treble") / 255.0;
  
    shader(theShader);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", millis() / 1000.0);
    theShader.setUniform("u_mouse", [mouseX / width, mouseY / height]);
    theShader.setUniform("u_bass", bass);
    theShader.setUniform("u_treble", treble);
  
    // Fondo con shader
    rect(-width / 2, -height / 2, width, height);
  
    // Esfera reactiva por encima
    resetShader(); // Desactiva el shader para dibujar elementos normales
    push();
    let s = map(bass, 0, 1, 50, 200); // Escala según bajos
    let r = map(treble, 0, 1, 100, 255);
    let g = map(bass, 0, 1, 50, 150);
    let b = map(treble, 0, 1, 150, 255);
    ambientLight(100);
    pointLight(255, 255, 255, 0, 0, 400);
    specularMaterial(r, g, b);
    shininess(50);
    translate(0, 0, 100); // Posicionar al frente
    sphere(s, 64, 64); // Esfera de alta calidad
    pop();
  }
  

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

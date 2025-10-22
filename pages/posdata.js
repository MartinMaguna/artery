// Configuración inicial
let timelineData;
let currentIndex = 0;
let particles = [];
let font;
let isTransitioning = false;

// Cargar datos y fuente
async function preload() {
  timelineData = loadJSON('posdata.json');
  font = loadFont('https://fonts.gstatic.com/s/crimsonpro/v24/q5uDsoa5M_tv7IihmnkabARboYF6CsKj.ttf');
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('visualizaciones-container');
  textFont(font);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Inicializar partículas
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(230, 10, 95);
  
  if (timelineData && timelineData.linea_tiempo) {
    const evento = timelineData.linea_tiempo[currentIndex];
    
    // Dibujar partículas
    particles.forEach(p => {
      p.update();
      p.display();
    });
    
    // Visualizar evento actual
    push();
    translate(width/2, height/2);
    
    // Año
    textSize(72);
    textAlign(CENTER, CENTER);
    fill(280, 80, 40);
    text(evento.año, 0, -120);
    
    // Título
    textSize(32);
    fill(320, 70, 30);
    text(evento.titulo, 0, 0);
    
    // Descripción
    textSize(18);
    textAlign(CENTER, CENTER);
    fill(0, 0, 30);
    text(wordWrap(evento.descripcion, 60), 0, 120);
    pop();
  }
}

// Clase Particle para efectos visuales
class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 6);
    this.speed = random(0.5, 2);
    this.angle = random(TWO_PI);
    this.hue = random(200, 320);
  }
  
  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }
  
  display() {
    noStroke();
    fill(this.hue, 50, 80, 0.6);
    circle(this.x, this.y, this.size);
  }
}

// Utilidad para envolver texto
function wordWrap(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = textWidth(currentLine + " " + word);
    if (width < maxWidth * 10) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines.join('\n');
}

// Interactividad
function mouseWheel(event) {
  if (!isTransitioning) {
    isTransitioning = true;
    if (event.delta > 0) {
      currentIndex = (currentIndex + 1) % timelineData.linea_tiempo.length;
    } else {
      currentIndex = (currentIndex - 1 + timelineData.linea_tiempo.length) % timelineData.linea_tiempo.length;
    }
    setTimeout(() => isTransitioning = false, 500);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
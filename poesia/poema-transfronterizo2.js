// === POÉTICAS TRANSFRONTERIZAS ===
// Cartografía de desplazamientos lumínicos
// Martín Maguna | p5.js + p5.sound

let audioBase;
let amplitude;
let tabla;
let migraciones = [];
let mapa = {};
let colores = {};
let escalaTiempo = {};
let factorVelocidad = 0.8;

function preload() {
  audioBase = loadSound('../asset/poeticastransfronterizas.mp3');
  tabla = loadTable('migracion.csv', 'csv', 'header');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  amplitude = new p5.Amplitude();

  // Coordenadas aproximadas para el "mapa poético del Cono Sur"
  mapa = {
    Uruguay: createVector(width * 0.55, height * 0.75),
    Argentina: createVector(width * 0.45, height * 0.8),
    Brasil: createVector(width * 0.75, height * 0.5),
    Chile: createVector(width * 0.25, height * 0.7),
    Paraguay: createVector(width * 0.55, height * 0.55),
    Bolivia: createVector(width * 0.45, height * 0.45)
  };

  // Colores simbólicos para cada país
  colores = {
    Argentina: color(210, 40, 100, 100),
    Brasil: color(100, 70, 100, 100),
    Chile: color(350, 50, 100, 100),
    Paraguay: color(20, 70, 100, 100),
    Bolivia: color(40, 80, 100, 100)
  };

  // Crear las "luces migrantes" a partir del CSV
  for (let r = 0; r < tabla.getRowCount(); r++) {
    let periodo = tabla.getString(r, 'Período');
    let pais = tabla.getString(r, 'Países');
    let valor = tabla.getNum(r, 'valor');
    let año = tabla.getNum(r, 'año');

    if (mapa[pais]) {
      migraciones.push(new LuzMigrante(pais, periodo, valor, año));
    }
  }
}

function draw() {
  // Fondo: deriva oceánica entre azul y violeta
  for (let y = 0; y < height; y++) {
    let hue = map(sin(frameCount * 0.002 + y * 0.005), -1, 1, 200, 260);
    stroke(hue, 40, 40, 10);
    line(0, y, width, y);
  }

  noStroke();
  let level = amplitude.getLevel();

  // Actualizar y dibujar luces migrantes
  for (let m of migraciones) {
    m.update(level);
    m.display();
  }

  // Leve velo de atmósfera
  fill(220, 10, 20, 5);
  rect(0, 0, width, height);
}

function mousePressed() {
  if (!audioBase.isPlaying()) {
    userStartAudio();
    audioBase.play();
  } else {
    audioBase.pause();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// === CLASE LUZ MIGRANTE ===
// representa una energía que viaja desde un país hacia Uruguay
class LuzMigrante {
  constructor(pais, periodo, valor, año) {
    this.origen = mapa[pais].copy();
    this.destino = mapa.Uruguay.copy();
    this.pos = this.origen.copy();
    this.pais = pais;
    this.periodo = periodo;
    this.valor = valor;
    this.año = año;
    this.t = random(0, TWO_PI);
    this.alpha = random(30, 80);
    this.vel = p5.Vector.sub(this.destino, this.origen)
      .normalize()
      .mult(random(0.1, 0.5));
    this.color = colores[pais] || color(0, 0, 100);
  }

  update(level) {
    // Movimiento pulsante: avanza, retrocede levemente, vibra
    this.t += 0.02 + level * 2;
    let offset = sin(this.t) * 2;
    this.pos.add(this.vel.copy().mult(factorVelocidad + offset * 0.05));
    if (dist(this.pos.x, this.pos.y, this.destino.x, this.destino.y) < 10) {
      this.pos = this.origen.copy(); // vuelve a migrar
    }
  }

  display() {
    let br = map(this.valor, 0, 100, 10, 100);
    let tam = map(this.valor, 0, 100, 2, 30);
    fill(hue(this.color), saturation(this.color), br, this.alpha);
    ellipse(this.pos.x, this.pos.y, tam);
  }
}

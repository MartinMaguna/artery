// ==== p5.js Parte ====

let particles = [];

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('p5-container');
  textFont('Georgia');
  textSize(32);
  noStroke();

  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }

  procesarTextoConRita(); // Llamamos Rita una vez que todo está montado
}

function draw() {
  background(10, 10, 30, 80);
  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.letter = random(['U', 'P', 'M']);
    this.color = color(random(150,255), random(50,200), random(100,255));
    this.size = random(20, 40);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }

  display() {
    fill(this.color);
    text(this.letter, this.x, this.y);
  }
}

// ==== RiTa.js Parte ====

function procesarTextoConRita() {
  const texto = `
Un Poema en Movimiento

Una política macabra
Un pacto de miseria
Un pacto maquiavélico
Un Pacto de Muerte
Un Plan Maravilloso
Urgente Propuesta de Marcha

Una Privilegiada minoría
Usted Miente Presidente
Unos Pocos Maníes
Unas pinches monedas
Usurpación Pública Maliciosa

Un País de Mierda
Un País Menos
Un Planeta Menos
Una Planta Menos
Una Planta Moribunda
Una Papelera Más
Una Pésima Manufacturera
Usina de Polución Mundial
Usinas Malolientes del País
Usina para morir

Uruguay Palma Mañana
Unidos para morir
Unión Pro Muerte
Unirse para molestar
Unidos Para Matar

Uruguayos Picaros y Malintencionados
Unos Proxenetas Maravillosos
Usamos Palabras Mágicas
Una Porquería Más
Úlceras Por Mayor
Uretra Pestilente Mortuoria

Una Permeabilidad Mágica
Ubicación perfectamente mapeada
Utopía de Prosperidad Mentirosa
Un peso muerto
Usufructo Patrimonial Macabro
Ukelele Pastillas Meconio

Uruguay Puede Movilizarse`;

  const palabras = RiTa.tokenize(texto);
  const palabrasFiltradas = palabras.filter(p => {
    const pos = RiTa.getPos(p)[0];
    return ['nn', 'vb', 'jj'].includes(pos); // sustantivos, verbos, adjetivos
  });

  const container = document.getElementById('rita-container');
  container.style.position = 'relative';
  container.style.height = '400px';
  container.style.overflow = 'hidden';

  palabrasFiltradas.forEach(p => {
    const span = document.createElement('span');
    span.textContent = p + " ";
    span.style.position = 'absolute';
    span.style.fontSize = (Math.random() * 24 + 12) + 'px';
    span.style.color = `hsl(${Math.random()*360}, 70%, 60%)`;
    span.style.left = Math.random() * window.innerWidth * 0.8 + 'px';
    span.style.top = Math.random() * 400 + 'px';
    span.style.transition = 'all 3s ease';
    container.appendChild(span);

    // Movimiento continuo
    setInterval(() => {
      span.style.left = Math.random() * window.innerWidth * 0.8 + 'px';
      span.style.top = Math.random() * 400 + 'px';
    }, 3000 + Math.random() * 2000);
  });
}

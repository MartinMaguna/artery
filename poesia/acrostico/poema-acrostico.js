import {
  db,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from './firebase-config.js';

// DOM Elements
const ritaContainer = document.getElementById('rita-container');
const acrosticForm = document.getElementById('acrosticForm');
const mensajeElement = document.getElementById('mensaje');
const interactionFeedback = document.getElementById('interaction-feedback');

// Array para almacenar versos válidos
let versosColaborativos = [];

// Variables globales al inicio del archivo
let dragonCursor;
let estela = [];
const MAX_ESTELA = 30;
const COLOR_INFECCION = [50, 255, 100];  // Verde brillante
let imagenCargada = false;
let mouseEnCanvas = false;
let especiesOriginales = {
  peces: [],
  medusas: [],
  plancton: [],
  noctilucas: [],
  bacterias: []
};

// Arrays para las criaturas
let peces = [];
let medusas = [];
let plancton = [];
let noctilucas = [];
let bacterias = [];

// Escucha en tiempo real de Firestore
const q = query(collection(db, 'versosUPM'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
  versosColaborativos = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    const verso = data.verso;
    if (typeof verso === 'string' && verso.trim() !== '') {
      versosColaborativos.push(verso);
    }
  });

  actualizarTextoConRita();
});

// Manejo del formulario
acrosticForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const lineU = document.getElementById('lineU');
  const lineP = document.getElementById('lineP');
  const lineM = document.getElementById('lineM');

  // Restablecer estado de validación
  [lineU, lineP, lineM].forEach(input => {
    input.setAttribute('aria-invalid', 'false');
  });

  let hasError = false;

  if (!lineU.value.trim().toUpperCase().startsWith('U')) {
    mostrarMensaje('El primer verso debe comenzar con U', 'error');
    lineU.setAttribute('aria-invalid', 'true');
    lineU.focus();
    hasError = true;
  }
  if (!lineP.value.trim().toUpperCase().startsWith('P')) {
    mostrarMensaje('El segundo verso debe comenzar con P', 'error');
    if (!hasError) {
      lineP.setAttribute('aria-invalid', 'true');
      lineP.focus();
      hasError = true;
    }
  }
  if (!lineM.value.trim().toUpperCase().startsWith('M')) {
    mostrarMensaje('El tercer verso debe comenzar con M', 'error');
    if (!hasError) {
      lineM.setAttribute('aria-invalid', 'true');
      lineM.focus();
      hasError = true;
    }
  }

  if (hasError) return;

  try {
    await addDoc(collection(db, 'versosUPM'), {
      verso: lineU.value.trim(),
      letra: 'U',
      timestamp: serverTimestamp()
    });
    await addDoc(collection(db, 'versosUPM'), {
      verso: lineP.value.trim(),
      letra: 'P',
      timestamp: serverTimestamp()
    });
    await addDoc(collection(db, 'versosUPM'), {
      verso: lineM.value.trim(),
      letra: 'M',
      timestamp: serverTimestamp()
    });

    acrosticForm.reset();
    mostrarMensaje('¡Versos enviados correctamente! El poema ha sido actualizado.', 'success');
    
    // Anunciar para lectores de pantalla
    const feedbackMsg = `Versos añadidos: "${lineU.value.trim()}", "${lineP.value.trim()}", "${lineM.value.trim()}"`;
    updateAccessibilityFeedback(feedbackMsg);
  } catch (error) {
    console.error("Error al guardar versos:", error);
    mostrarMensaje('Error al guardar los versos. Por favor, inténtalo de nuevo.', 'error');
  }
});

function mostrarMensaje(texto, tipo) {
  const mensajeElement = document.getElementById('mensaje');
  mensajeElement.textContent = texto;
  mensajeElement.className = tipo;
  mensajeElement.setAttribute('role', 'alert');
  
  setTimeout(() => {
    mensajeElement.textContent = '';
    mensajeElement.className = '';
  }, 5000); // Aumentado a 5 segundos para dar más tiempo de lectura
}

// Mejorar la navegación por teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Cerrar cualquier diálogo o mensaje de error
    const mensaje = document.getElementById('mensaje');
    if (mensaje && mensaje.textContent) {
      mensaje.textContent = '';
      mensaje.className = '';
    }
  }
});

// Función para actualizar la retroalimentación de accesibilidad
function updateAccessibilityFeedback(message) {
  const feedback = document.getElementById('interaction-feedback');
  if (feedback) {
    feedback.textContent = message;
    // Asegurar que el mensaje sea leído por lectores de pantalla
    feedback.setAttribute('role', 'alert');
  }
}

// Visual generativo con p5.js en #p5-container
new p5((p) => {
  let grid = [];
  let nextGrid = [];
  let cellSize = 2;
  let cols, rows;
  let versoActual = '';
  let letrasLluvia = [];
  let mouseInteraction = {
    radio: 150,
    fuerza: 0.8,
    luz: 0
  };
  
  const COLORES = {
    PECES: [30, 150, 255],      // Azul
    MEDUSAS: [255, 100, 200],   // Rosa
    PLANCTON: [100, 255, 150],  // Verde
    AUTOMATA: [180, 255, 255],  // Cyan
    NOCTILUCA: [255, 200, 50],  // Amarillo
    BACTERIA: [150, 50, 255]    // Violeta
  };

  function distancia(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  function mostrarVerso(x, y, tipo) {
    if (versosColaborativos.length > 0) {
      const versoAleatorio = versosColaborativos[Math.floor(p.random(versosColaborativos.length))];
      if (typeof versoAleatorio === 'string') {
        // Actualizar retroalimentación para lectores de pantalla
        updateAccessibilityFeedback(`Interacción con ${tipo}: "${versoAleatorio}"`);
        
        const palabras = versoAleatorio.split(' ');
        const anguloPorPalabra = p.TWO_PI / palabras.length;
        
        letrasLluvia = [];
        palabras.forEach((palabra, i) => {
          const angulo = anguloPorPalabra * i;
          const radio = 60;
          const posX = x + Math.cos(angulo) * radio;
          const posY = y + Math.sin(angulo) * radio;
          
          for(let j = 0; j < palabra.length; j++) {
            letrasLluvia.push(new Letra(
              palabra[j],
              posX + j * 15 - (palabra.length * 7),
              posY,
              tipo
            ));
          }
        });
      }
    }
  }
  
  class Noctiluca {
    constructor() {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.size = p.random(3, 8);
      this.brillo = 0;
      this.maxBrillo = p.random(150, 255);
      this.velocidad = p.random(0.2, 0.5);
      this.angulo = p.random(p.TWO_PI);
      this.excitacion = 0;
      this.infectado = false;
      this.tiempoInfeccion = 0;
    }
    
    update() {
      if (!this.infectado) {
        for (let punto of estela) {
          if (distancia(this.x, this.y, punto.x, punto.y) < 30) {
            this.infectado = true;
            this.tiempoInfeccion = 255;
            break;
          }
        }
      } else {
        this.tiempoInfeccion -= 5;
        if (this.tiempoInfeccion <= 0) return false;
      }

      // Movimiento browniano
      this.angulo += p.random(-0.5, 0.5);
      this.x += Math.cos(this.angulo) * this.velocidad;
      this.y += Math.sin(this.angulo) * this.velocidad;
      
      // Reacción al mouse
      const dist = distancia(this.x, this.y, p.mouseX, p.mouseY);
      if (dist < mouseInteraction.radio) {
        this.excitacion = p.map(dist, 0, mouseInteraction.radio, 1, 0);
        this.brillo = p.lerp(this.brillo, this.maxBrillo, 0.1);
      } else {
        this.brillo = p.lerp(this.brillo, 0, 0.05);
      }
      
      // Mantener en pantalla
      if (this.x < 0) this.x = p.width;
      if (this.x > p.width) this.x = 0;
      if (this.y < 0) this.y = p.height;
      if (this.y > p.height) this.y = 0;

      return true;
    }
    
    display() {
      const colorActual = this.infectado ? 
        [
          p.lerp(COLORES.NOCTILUCA[0], COLOR_INFECCION[0], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.NOCTILUCA[1], COLOR_INFECCION[1], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.NOCTILUCA[2], COLOR_INFECCION[2], 1 - this.tiempoInfeccion/255)
        ] :
        COLORES.NOCTILUCA;

      p.noStroke();
      // Halo exterior
      p.fill(colorActual[0], colorActual[1], colorActual[2], this.brillo * 0.3);
      p.circle(this.x, this.y, this.size * 3);
      
      // Núcleo brillante
      p.fill(colorActual[0], colorActual[1], colorActual[2], this.brillo);
      p.circle(this.x, this.y, this.size);
    }
    
    clicked() {
      return distancia(this.x, this.y, p.mouseX, p.mouseY) < this.size * 1.5;
    }
  }

  class Bacteria {
    constructor(x, y) {
      this.x = x || p.random(p.width);
      this.y = y || p.random(p.height);
      this.size = p.random(1, 3);
      this.velocidad = p.random(0.3, 0.8);
      this.angulo = p.random(p.TWO_PI);
      this.energia = p.random(100, 200);
      this.division = false;
      this.brillo = p.random(40, 80);
      this.edad = 0;
      this.madurez = 100;
      this.infectado = false;
      this.tiempoInfeccion = 0;
    }
    
    update() {
      if (!this.infectado) {
        for (let punto of estela) {
          if (distancia(this.x, this.y, punto.x, punto.y) < 30) {
            this.infectado = true;
            this.tiempoInfeccion = 255;
            break;
          }
        }
      } else {
        this.tiempoInfeccion -= 5;
        if (this.tiempoInfeccion <= 0) return false;
      }

      this.edad++;
      this.energia -= 0.1;
      
      // Movimiento bacteriano
      if (p.frameCount % 30 === 0) {
        this.angulo += p.random(-p.PI/4, p.PI/4);
      }
      
      this.x += Math.cos(this.angulo) * this.velocidad;
      this.y += Math.sin(this.angulo) * this.velocidad;
      
      // Mantener en pantalla
      if (this.x < 0) this.x = p.width;
      if (this.x > p.width) this.x = 0;
      if (this.y < 0) this.y = p.height;
      if (this.y > p.height) this.y = 0;
      
      // Reproducción si hay suficiente energía y edad
      if (this.energia > 150 && this.edad > this.madurez) {
        this.division = true;
        this.energia /= 2;
        return new Bacteria(this.x + p.random(-10, 10), this.y + p.random(-10, 10));
      }
      
      return null;
    }
    
    display() {
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.angulo);
      
      const colorActual = this.infectado ?
        [
          p.lerp(COLORES.BACTERIA[0], COLOR_INFECCION[0], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.BACTERIA[1], COLOR_INFECCION[1], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.BACTERIA[2], COLOR_INFECCION[2], 1 - this.tiempoInfeccion/255)
        ] :
        COLORES.BACTERIA;
      
      const brilloActual = this.brillo + Math.sin(p.frameCount * 0.1) * 20;
      
      // Halo bioluminiscente
      p.noStroke();
      p.fill(colorActual[0], colorActual[1], colorActual[2], brilloActual * 0.3);
      p.circle(0, 0, this.size * 2);
      
      // Cuerpo principal
      p.fill(colorActual[0], colorActual[1], colorActual[2], brilloActual);
      p.circle(0, 0, this.size);
      
      p.pop();
    }
    
    clicked() {
      return distancia(this.x, this.y, p.mouseX, p.mouseY) < this.size * 2;
    }
  }

  class Medusa {
    constructor() {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.size = p.random(10, 18); // Tamaño reducido
      this.velocidad = p.random(0.2, 0.8);
      this.pulso = 0;
      this.pulsoVel = p.random(0.02, 0.04);
      this.tentaculos = [];
      this.mouseInfluencia = { x: 0, y: 0 };
      this.desintegracion = 0;
      this.colorTransicion = 0;
      this.particulas = [];
      this.infectado = false;
      this.tiempoInfeccion = 0;
      for(let i = 0; i < 8; i++) {
        this.tentaculos.push({
          largo: p.random(this.size * 1.5, this.size * 2.5),
          angulo: (i * p.TWO_PI / 8) + p.random(-0.2, 0.2)
        });
      }
    }
    
    update() {
      if (!this.infectado && this.checkInfection()) {
        updateAccessibilityFeedback('Una medusa ha sido afectada por la estela verde');
      }

      // Movimiento base
      this.y -= this.velocidad;
      if (this.y < -this.size * 3) this.y = p.height + this.size;
      this.pulso = (Math.sin(p.frameCount * this.pulsoVel) + 1) * 0.5;
      
      // Reacción al mouse y otras medusas
      let fuerzaTotal = p.createVector(0, 0);
      
      // Efecto de desintegración cerca del mouse
      const distMouse = distancia(this.x, this.y, p.mouseX, p.mouseY);
      if (distMouse < mouseInteraction.radio * 1.2) {
        // Desintegración más repentina
        this.desintegracion = p.lerp(this.desintegracion, 1, 0.2);
        this.colorTransicion = p.lerp(this.colorTransicion, 1, 0.1);
        
        // Crear más partículas para efecto más dramático
        if (p.random() < 0.4) {
          for (let i = 0; i < 3; i++) {
            this.particulas.push({
              x: this.x + p.random(-this.size, this.size),
              y: this.y + p.random(-this.size, this.size),
              vx: p.random(-2, 2),
              vy: p.random(-2, 2),
              alpha: 255,
              size: p.random(2, 4)
            });
          }
        }
        
        const angulo = Math.atan2(this.y - p.mouseY, this.x - p.mouseX);
        fuerzaTotal.add(p.createVector(
          Math.cos(angulo) * mouseInteraction.fuerza,
          Math.sin(angulo) * mouseInteraction.fuerza
        ));
      } else {
        // Recuperación gradual
        this.desintegracion = p.lerp(this.desintegracion, 0, 0.05);
        this.colorTransicion = p.lerp(this.colorTransicion, 0, 0.01);
      }
      
      // Actualizar partículas
      this.particulas = this.particulas.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 5;
        return p.alpha > 0;
      });
      
      // Interacción con otras medusas
      medusas.forEach(otra => {
        if (otra !== this) {
          const d = distancia(this.x, this.y, otra.x, otra.y);
          if (d < 100) {
            const angulo = Math.atan2(this.y - otra.y, this.x - otra.x);
            fuerzaTotal.add(p.createVector(
              Math.cos(angulo) * 0.3,
              Math.sin(angulo) * 0.3
            ));
          }
        }
      });
      
      this.x += fuerzaTotal.x;
      this.y += fuerzaTotal.y;
      
      // Ondulación de tentáculos
      this.tentaculos.forEach(t => {
        t.angulo += p.noise(this.x * 0.01, this.y * 0.01, p.frameCount * 0.02) * 0.1 - 0.05;
      });
      
      return true;
    }
    
    display() {
      p.push();
      p.translate(this.x, this.y);
      
      const colorActual = this.infectado ? 
        [
          p.lerp(COLORES.MEDUSAS[0], COLOR_INFECCION[0], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.MEDUSAS[1], COLOR_INFECCION[1], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.MEDUSAS[2], COLOR_INFECCION[2], 1 - this.tiempoInfeccion/255)
        ] :
        [
          p.lerp(COLORES.MEDUSAS[0] * 0.8, 230, this.colorTransicion),
          p.lerp(COLORES.MEDUSAS[1] * 0.8, 140, this.colorTransicion),
          p.lerp(COLORES.MEDUSAS[2] * 0.8, 80, this.colorTransicion)
        ];
      
      // Factor de opacidad basado en la desintegración
      const opacidad = 1 - this.desintegracion;
      
      if (opacidad > 0.1) { // Solo dibujar si no está completamente desintegrada
        // Tentáculos
        p.noFill();
        this.tentaculos.forEach(t => {
          p.beginShape();
          p.stroke(colorActual[0], colorActual[1], colorActual[2], 255 * opacidad);
          for(let i = 0; i < 5; i++) {
            let y = (t.largo / 5) * i;
            let x = Math.sin((p.frameCount * 0.05) + i * 0.5) * (8 - i);
            // Añadir distorsión basada en la desintegración
            x += p.random(-this.desintegracion * 8, this.desintegracion * 8);
            y += p.random(-this.desintegracion * 8, this.desintegracion * 8);
            p.vertex(x + Math.cos(t.angulo) * 5, y + Math.sin(t.angulo) * 5);
          }
          p.endShape();
        });
        
        // Cuerpo
        p.noStroke();
        // Cuerpo principal sin transparencia
        p.fill(colorActual[0], colorActual[1], colorActual[2], 255 * opacidad);
        p.ellipse(0, 0, this.size * 1.8, this.size * 1.4);
        
        // Centro
        p.fill(colorActual[0] + 20, colorActual[1] + 20, colorActual[2] + 20, 255 * opacidad);
        p.ellipse(0, 0, this.size * 1.2, this.size);
      }
      
      // Dibujar partículas de desintegración
      this.particulas.forEach(part => {
        p.noStroke();
        p.fill(colorActual[0], colorActual[1], colorActual[2], part.alpha);
        p.circle(part.x - this.x, part.y - this.y, part.size);
      });
      
      p.pop();
    }
    
    clicked() {
      return distancia(this.x, this.y, p.mouseX, p.mouseY) < this.size;
    }

    checkInfection() {
      for (let punto of estela) {
        if (distancia(this.x, this.y, punto.x, punto.y) < 30) {
          this.infectado = true;
          this.tiempoInfeccion = 255;
          return true;
        }
      }
      return false;
    }
  }
  
  class Plancton {
    constructor() {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.size = p.random(2, 4);
      this.velocidad = p.random(0.2, 0.5);
      this.angulo = p.random(p.TWO_PI);
      this.energia = p.random(80, 120);
      this.infectado = false;
      this.tiempoInfeccion = 0;
    }
    
    update() {
      if (!this.infectado && this.checkInfection()) {
        updateAccessibilityFeedback('Una colonia de plancton ha sido afectada por la estela verde');
      }

      this.energia -= 0.05;
      
      // Movimiento
      this.x += Math.cos(this.angulo) * this.velocidad;
      this.y += Math.sin(this.angulo) * this.velocidad;
      
      // Mantener en pantalla
      if (this.x < 0) this.x = p.width;
      if (this.x > p.width) this.x = 0;
      if (this.y < 0) this.y = p.height;
      if (this.y > p.height) this.y = 0;
      
      return this.energia > 0;
    }
    
    display() {
      const colorActual = this.infectado ?
        [
          p.lerp(COLORES.PLANCTON[0], COLOR_INFECCION[0], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.PLANCTON[1], COLOR_INFECCION[1], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.PLANCTON[2], COLOR_INFECCION[2], 1 - this.tiempoInfeccion/255)
        ] :
        COLORES.PLANCTON;

      p.noStroke();
      // Resplandor
      p.fill(colorActual[0], colorActual[1], colorActual[2], this.energia * 0.3);
      p.ellipse(this.x, this.y, this.size * 3, this.size * 3);
      
      // Centro brillante
      p.fill(colorActual[0], colorActual[1], colorActual[2], this.energia);
      p.ellipse(this.x, this.y, this.size, this.size);
    }
    
    clicked() {
      return distancia(this.x, this.y, p.mouseX, p.mouseY) < this.size * 2;
    }

    checkInfection() {
      for (let punto of estela) {
        if (distancia(this.x, this.y, punto.x, punto.y) < 30) {
          this.infectado = true;
          this.tiempoInfeccion = 255;
          return true;
        }
      }
      return false;
    }
  }
  
  class Pez {
    constructor() {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.size = p.random(8, 15);
      this.velocidad = p.random(0.5, 1.5);
      this.angulo = p.random(p.TWO_PI);
      this.luminosidad = p.random(40, 80);
      this.pulso = 0;
      this.pulsoVel = p.random(0.02, 0.05);
      this.mouseInfluencia = { x: 0, y: 0 };
      this.infectado = false;
      this.tiempoInfeccion = 0;
    }
    
    update() {
      if (!this.infectado && this.checkInfection()) {
        updateAccessibilityFeedback('Un pez ha sido afectado por la estela verde');
      }
      return true;
    }
    
    display() {
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.angulo);
      
      const colorActual = this.infectado ?
        [
          p.lerp(COLORES.PECES[0], COLOR_INFECCION[0], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.PECES[1], COLOR_INFECCION[1], 1 - this.tiempoInfeccion/255),
          p.lerp(COLORES.PECES[2], COLOR_INFECCION[2], 1 - this.tiempoInfeccion/255)
        ] :
        COLORES.PECES;
      
      const resplandor = this.luminosidad * (0.5 + this.pulso * 0.5);
      p.noStroke();
      
      // Resplandor exterior
      p.fill(colorActual[0], colorActual[1], colorActual[2], resplandor * 0.2);
      p.ellipse(0, 0, this.size * 2.5, this.size * 1.8);
      
      // Cuerpo principal
      p.fill(colorActual[0], colorActual[1], colorActual[2], resplandor * 0.4);
      p.ellipse(0, 0, this.size * 1.8, this.size * 1.3);
      
      // Núcleo
      p.fill(colorActual[0], colorActual[1], colorActual[2], resplandor);
      p.ellipse(0, 0, this.size * 0.8, this.size * 0.6);
      
      p.pop();
    }

    checkInfection() {
      for (let punto of estela) {
        if (distancia(this.x, this.y, punto.x, punto.y) < 30) {
          this.infectado = true;
          this.tiempoInfeccion = 255;
          return true;
        }
      }
      return false;
    }
  }

  class Letra {
    constructor(letra, x, y, tipo) {
      this.letra = letra;
      this.x = x;
      this.y = y;
      this.tipo = tipo;
      this.alpha = 255;
      this.velocidad = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
      this.tamaño = 16;
      this.rotacion = p.random(-0.1, 0.1);
      this.angulo = 0;
      this.ondulacion = p.random(p.TWO_PI);
    }
    
    update() {
      this.ondulacion += 0.05;
      this.x += this.velocidad.x + Math.sin(this.ondulacion) * 0.3;
      this.y += this.velocidad.y;
      this.angulo += this.rotacion;
      this.alpha -= 1;
      
      // Atraer criaturas cercanas hacia la letra
      const radio = 100;
      
      peces.forEach(pez => {
        const d = distancia(this.x, this.y, pez.x, pez.y);
        if (d < radio) {
          const atraccion = p.map(d, 0, radio, 0.5, 0);
          pez.x += (this.x - pez.x) * atraccion;
          pez.y += (this.y - pez.y) * atraccion;
          if (d < 30) {
          }
        }
      });
      
      medusas.forEach(medusa => {
        const d = distancia(this.x, this.y, medusa.x, medusa.y);
        if (d < radio) {
          const atraccion = p.map(d, 0, radio, 0.3, 0);
          medusa.x += (this.x - medusa.x) * atraccion;
          medusa.y += (this.y - medusa.y) * atraccion;
          if (d < 40) {
          }
        }
      });
    }
    
    display() {
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.angulo);
      
      // Efecto de disolución en el agua
      const ondulacionAlpha = Math.sin(this.ondulacion) * 20;
      
      // Halo exterior
      p.noStroke();
      p.fill(255, 255, 255, (this.alpha + ondulacionAlpha) * 0.2);
      p.textSize(this.tamaño * 1.2);
      p.text(this.letra, 0, 0);
      
      // Letra principal
      p.fill(255, 255, 255, this.alpha + ondulacionAlpha);
      p.textSize(this.tamaño);
      p.text(this.letra, 0, 0);
      p.pop();
    }
    
    isDead() {
      return this.alpha <= 0;
    }
  }

  function initGrid() {
    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      nextGrid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = p.random() > 0.95; // Aún menos células activas
        nextGrid[i][j] = false;
      }
    }
  }

  function updateGrid() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let vecinos = contarVecinos(i, j);
        if (grid[i][j]) {
          nextGrid[i][j] = vecinos === 2 || vecinos === 3;
        } else {
          nextGrid[i][j] = vecinos === 3;
        }
      }
    }
    
    let temp = grid;
    grid = nextGrid;
    nextGrid = temp;
  }

  function contarVecinos(x, y) {
    let suma = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        suma += grid[col][row] ? 1 : 0;
      }
    }
    suma -= grid[x][y] ? 1 : 0;
    return suma;
  }

  p.mousePressed = () => {
    let interactionOccurred = false;
    
    // Verificar clicks en las criaturas
    for (let pez of peces) {
      if (pez.clicked()) {
        mostrarVerso(pez.x, pez.y, 'PECES');
        interactionOccurred = true;
        break;
      }
    }
    
    if (!interactionOccurred) {
      for (let medusa of medusas) {
        if (medusa.clicked()) {
          mostrarVerso(medusa.x, medusa.y, 'MEDUSAS');
          interactionOccurred = true;
          break;
        }
      }
    }
    
    if (!interactionOccurred) {
      for (let p of plancton) {
        if (p.clicked()) {
          mostrarVerso(p.x, p.y, 'PLANCTON');
          interactionOccurred = true;
          break;
        }
      }
    }

    if (!interactionOccurred) {
      updateAccessibilityFeedback('No hay criaturas marinas cerca para interactuar');
    }
  };

  p.preload = () => {
    dragonCursor = p.loadImage('../../asset/UPM.png', 
      () => { 
        console.log('Imagen del dragón cargada correctamente');
        imagenCargada = true; 
      },
      () => {
        console.error('Error cargando la imagen del dragón');
      }
    );
  };

  p.setup = () => {
    console.log('Iniciando setup...');
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent('p5-container');
    canvas.mouseOver(() => {
      console.log('Mouse sobre el canvas');
      mouseEnCanvas = true;
    });
    canvas.mouseOut(() => {
      console.log('Mouse fuera del canvas');
      mouseEnCanvas = false;
    });
    
    p.textFont('Special Elite');
    p.textAlign(p.CENTER, p.CENTER);
    p.background(0);
    p.noCursor();
    
    cols = Math.floor(p.width / cellSize);
    rows = Math.floor(p.height / cellSize);
    
    initGrid();
    initEcosistema();
    console.log('Setup completado. Dimensiones del canvas:', p.width, p.height);
  };

  function initEcosistema() {
    console.log('Iniciando ecosistema...');
    // Limpiar arrays existentes
    peces = [];
    medusas = [];
    plancton = [];
    noctilucas = [];
    bacterias = [];

    // Crear un ecosistema abundante
    for (let i = 0; i < 30; i++) peces.push(new Pez());
    for (let i = 0; i < 15; i++) medusas.push(new Medusa());
    for (let i = 0; i < 200; i++) plancton.push(new Plancton());
    for (let i = 0; i < 100; i++) noctilucas.push(new Noctiluca());
    for (let i = 0; i < 80; i++) bacterias.push(new Bacteria());

    console.log('Ecosistema creado:', {
      peces: peces.length,
      medusas: medusas.length,
      plancton: plancton.length,
      noctilucas: noctilucas.length,
      bacterias: bacterias.length
    });

    // Guardar copia del ecosistema original
    especiesOriginales = {
      peces: peces.length,
      medusas: medusas.length,
      plancton: plancton.length,
      noctilucas: noctilucas.length,
      bacterias: bacterias.length
    };
  }

  function regenerarEcosistema() {
    // Regenerar especies gradualmente
    if (peces.length < especiesOriginales.peces) {
      peces.push(new Pez());
    }
    if (medusas.length < especiesOriginales.medusas) {
      medusas.push(new Medusa());
    }
    if (plancton.length < especiesOriginales.plancton) {
      for(let i = 0; i < 5; i++) plancton.push(new Plancton());
    }
    if (noctilucas.length < especiesOriginales.noctilucas) {
      for(let i = 0; i < 3; i++) noctilucas.push(new Noctiluca());
    }
    if (bacterias.length < especiesOriginales.bacterias) {
      for(let i = 0; i < 2; i++) bacterias.push(new Bacteria());
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    cols = Math.floor(p.width / cellSize);
    rows = Math.floor(p.height / cellSize);
    initGrid();
  };

  p.draw = () => {
    p.background(0);
    
    // Actualizar estela del dragón solo si el mouse está en el canvas
    if (mouseEnCanvas) {
      if (p.frameCount % 2 === 0) {
        estela.push({
          x: p.mouseX,
          y: p.mouseY,
          radio: p.random(40, 60),
          alpha: 255
        });
        if (estela.length > MAX_ESTELA) estela.shift();
      }
      
      // Dibujar estela con efecto gaseoso
      estela.forEach((punto, i) => {
        punto.alpha = p.map(i, 0, estela.length - 1, 0, 255);
        p.noStroke();
        // Capa exterior difusa
        p.fill(COLOR_INFECCION[0], COLOR_INFECCION[1], COLOR_INFECCION[2], punto.alpha * 0.1);
        p.circle(punto.x, punto.y, punto.radio * 1.5);
        // Capa media
        p.fill(COLOR_INFECCION[0], COLOR_INFECCION[1], COLOR_INFECCION[2], punto.alpha * 0.2);
        p.circle(punto.x, punto.y, punto.radio);
        // Núcleo brillante
        p.fill(COLOR_INFECCION[0], COLOR_INFECCION[1], COLOR_INFECCION[2], punto.alpha * 0.3);
        p.circle(punto.x, punto.y, punto.radio * 0.5);
      });
    } else {
      estela = [];
      regenerarEcosistema();
    }

    // Dibujar autómata celular
    p.noStroke();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j]) {
          const brillo = p.noise(i * 0.1, j * 0.1, p.frameCount * 0.01) * 100;
          p.fill(COLORES.AUTOMATA[0], COLORES.AUTOMATA[1], COLORES.AUTOMATA[2], brillo * 0.3);
          p.rect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }

    // Actualizar y mostrar todas las criaturas
    bacterias.forEach(b => b.display());
    plancton.forEach(p => p.display());
    noctilucas.forEach(n => {
      n.update();
      n.display();
    });
    medusas.forEach(m => {
      m.update();
      m.display();
    });
    peces.forEach(pez => {
      pez.update();
      pez.display();
    });

    // Dibujar el cursor del dragón
    if (imagenCargada && dragonCursor && mouseEnCanvas) {
      p.push();
      p.imageMode(p.CENTER);
      p.translate(p.mouseX, p.mouseY);
      const escala = 0.15;
      p.scale(escala);
      p.image(dragonCursor, 0, 0);
      p.pop();
    }
  };

  // Añadir manejo de teclado para navegación accesible
  p.keyPressed = () => {
    // Teclas de flecha para navegar por el canvas
    if (p.keyCode === p.LEFT_ARROW) {
      updateAccessibilityFeedback('Moviendo hacia la izquierda en el ecosistema marino');
      // Simular movimiento del cursor
      p.mouseX = Math.max(0, p.mouseX - 50);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      updateAccessibilityFeedback('Moviendo hacia la derecha en el ecosistema marino');
      p.mouseX = Math.min(p.width, p.mouseX + 50);
    } else if (p.keyCode === p.UP_ARROW) {
      updateAccessibilityFeedback('Moviendo hacia arriba en el ecosistema marino');
      p.mouseY = Math.max(0, p.mouseY - 50);
    } else if (p.keyCode === p.DOWN_ARROW) {
      updateAccessibilityFeedback('Moviendo hacia abajo en el ecosistema marino');
      p.mouseY = Math.min(p.height, p.mouseY + 50);
    } else if (p.keyCode === p.ENTER || p.keyCode === p.RETURN) {
      // Simular clic para interactuar con criaturas cercanas
      p.mousePressed();
    }
  };
});

// Generación poética con RiTa.js
function actualizarTextoConRita() {
  if (!ritaContainer) return;
  
  ritaContainer.innerHTML = '';

  if (versosColaborativos.length < 3) {
    ritaContainer.innerHTML = '<p>Esperando más versos para generar acróstico...</p>';
    return;
  }

  // Filtrar versos por letra inicial para el acróstico UPM
  const letras = ['U', 'P', 'M'];
  let versosAcrostico = [];

  for (let i = 0; i < letras.length; i++) {
    const candidatos = versosColaborativos.filter(v =>
      typeof v === 'string' && v.trim().toUpperCase().startsWith(letras[i])
    );
    if (candidatos.length > 0) {
      versosAcrostico.push(candidatos[Math.floor(Math.random() * candidatos.length)]);
    } else {
      versosAcrostico.push(`${letras[i]}...`);
    }
  }

  // Construir el HTML del acróstico
  const acrosticoHTML = versosAcrostico.map((verso) => {
    return `<p class="verse" tabindex="0">${verso}</p>`;
  }).join('');

  // Añadir variación poética usando RiTa si hay suficientes versos
  let varianteRita = "";
  if (versosColaborativos.length >= 5 && typeof RiTa !== "undefined") {
    const rm = new RiTa.markov(3);
    versosColaborativos.forEach(verso => rm.addText(verso));
    const nuevoVerso = rm.generate(1)[0];
    varianteRita = `
      <div class="rita-variacion">
        <p class="verse" tabindex="0">${nuevoVerso}</p>
      </div>
    `;
  }

  ritaContainer.innerHTML = `
    <div class="acrostico-generado">
      ${acrosticoHTML}
    </div>
    ${varianteRita}
  `;
}

// Navegación del libro
document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.page');
  const prevBtn = document.querySelector('.page-nav.prev');
  const nextBtn = document.querySelector('.page-nav.next');
  const currentPageSpan = document.getElementById('current-page');
  const totalPagesSpan = document.getElementById('total-pages');
  let currentPage = 0;

  // Actualizar total de páginas
  totalPagesSpan.textContent = pages.length;

  // Mostrar página actual
  function showPage(pageIndex) {
    pages.forEach(page => page.classList.remove('active'));
    pages[pageIndex].classList.add('active');
    currentPageSpan.textContent = pageIndex;
    
    // Actualizar estado de los botones
    prevBtn.style.display = pageIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = pageIndex === pages.length - 1 ? 'none' : 'block';
  }

  // Event listeners para navegación
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  // Inicializar primera página
  showPage(0);
});
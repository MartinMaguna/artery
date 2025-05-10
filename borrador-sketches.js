// CÍRCULO ORGÁNICO

let ringCount = 200;
let segmentCount = 300;
let baseMaxRadius = 300;
let baseNoiseScale = 0.5;
let baseSwirlFactor = 0.1;
let zNoiseOffset = 0.02;
let t = 0;

let headerHeight = 0;
let footerHeight = 0;
let canvasHeight = 0;

function setup() {
  // Tomamos la altura real del header y footer
  headerHeight = document.querySelector('header')?.offsetHeight || 0;
  footerHeight = document.querySelector('footer')?.offsetHeight || 0;

  canvasHeight = windowHeight - headerHeight - footerHeight;

  let canvas = createCanvas(windowWidth, canvasHeight);
  canvas.parent('art-generativo');

  stroke(255, 255, 255, 40);
  strokeWeight(0.5);
  noFill();
}

function draw() {
  background(0, 10);

  // Centro relativo al canvas (que ahora tiene margen superior por el header)
  let centerX = width / 2;
  let centerY = height / 2;

  let interactiveX = mouseX || touches[0]?.x || centerX;
  let interactiveY = mouseY || touches[0]?.y || centerY;

  let noiseScale = baseNoiseScale + map(interactiveX, 0, width, 0, 1.0);
  let swirlFactor = baseSwirlFactor + map(interactiveY, 0, height, 0, 0.3);

  // Calculamos un radio máximo que asegure que no se sale del canvas
  let safeRadius = Math.min(width, height) * 0.45;

  let maxRadius = Math.min(baseMaxRadius + map(interactiveX + interactiveY, 0, width + height, -100, 100), safeRadius);

  for (let i = 0; i < ringCount - 1; i++) {
    beginShape();
    for (let j = 0; j < segmentCount; j++) {
      let angle = map(j, 0, segmentCount, 0, TWO_PI);
      let swirl = i * swirlFactor;
      let baseRadius = map(i, 0, ringCount - 1, 20, maxRadius);

      let n = noise(
        (cos(angle + swirl) + 1) * noiseScale,
        (sin(angle + swirl) + 1) * noiseScale,
        i * zNoiseOffset + t
      );

      let r = baseRadius + n * 100;
      let x = r * cos(angle + swirl);
      let y = r * sin(angle + swirl);
      vertex(x + centerX, y + centerY);
    }
    endShape(CLOSE);
  }

  t += 0.01;
}

function windowResized() {
  headerHeight = document.querySelector('header')?.offsetHeight || 0;
  footerHeight = document.querySelector('footer')?.offsetHeight || 0;
  canvasHeight = windowHeight - headerHeight - footerHeight;
  resizeCanvas(windowWidth, canvasHeight);
}




// ARTERIA 1
let nodes = [];
let nodeCount = 600;
let noiseScale = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  stroke(255, 40);
  noFill();

  // Crear nodos distribuidos aleatoriamente
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      px: null,
      py: null,
      angle: random(TWO_PI),
      stepSize: random(0.5, 2),
      life: int(random(100, 300))
    });
  }
}

function draw() {
  for (let n of nodes) {
    if (n.life > 0) {
      let nx = noise(n.x * noiseScale, n.y * noiseScale);
      let angle = nx * TWO_PI * 4;
      n.px = n.x;
      n.py = n.y;
      n.x += cos(angle) * n.stepSize;
      n.y += sin(angle) * n.stepSize;

      line(n.px, n.py, n.x, n.y);

      n.life--;

      // Teletransportarse si sale de los límites
      if (n.x < 0 || n.x > width || n.y < 0 || n.y > height) {
        n.x = random(width);
        n.y = random(height);
        n.life = int(random(100, 300));
      }
    }
  }
}




//ARTERIA 2











//PELOTA | PRIMERA IDEA DE PORTADA PARA ENSAYOS
function sketchPortadaEnsayos(p) {
  let particles = [];
  let planetRadius = 150;
  let planetRotationX = 0;
  let planetRotationY = 0;

  p.setup = function () {
    const containerWidth = document.getElementById('sketchPortadaEnsayos').offsetWidth;
    let canvas = p.createCanvas(containerWidth, 500, p.WEBGL);
    canvas.parent('sketchPortadaEnsayos');
    p.noStroke();
    p.frameRate(60);  // Animación fluida

    // Inicializar partículas en la esfera
    for (let lat = -p.PI / 2; lat < p.PI / 2; lat += 0.05) {
      for (let lon = -p.PI; lon < p.PI; lon += 0.1) {
        let x = planetRadius * p.cos(lat) * p.cos(lon);
        let y = planetRadius * p.cos(lat) * p.sin(lon);
        let z = planetRadius * p.sin(lat);

        // Crear una partícula en cada coordenada
        particles.push(new Particle(x, y, z));
      }
    }
  };

  p.draw = function () {
    p.background(0);

    // Actualizar la rotación con base en la posición del mouse
    planetRotationX = p.map(p.mouseY, 0, p.height, -p.PI, p.PI);
    planetRotationY = p.map(p.mouseX, 0, p.width, -p.PI, p.PI);

    // Aplicar la rotación
    p.push();
    p.rotateX(planetRotationX); // Rotación en el eje X
    p.rotateY(planetRotationY); // Rotación en el eje Y

    // Dibujar las partículas de la esfera
    for (let particle of particles) {
      particle.show();
    }

    p.pop(); // Fin de la rotación
  };

  // Clase para las partículas (simulando los puntos de la esfera)
  class Particle {
    constructor(x, y, z) {
      this.pos = p.createVector(x, y, z);
    }

    show() {
      p.push();
      p.translate(this.pos.x, this.pos.y, this.pos.z);
      p.fill(255); // Blanco para las partículas
      p.sphere(2); // Partícula representada por una esfera pequeña
      p.pop();
    }
  }
}

// Crear instancia de p5.js
new p5(sketchPortadaEnsayos);




/// IDEA SKETCH PORTADA POESIA INTERESANTE

function sketchPortadaPoesia(p) {
  const versos = [
    "Abyecto, un susurro que emerge de la tierra.",
    "Alquimia, la transmutación de lo olvidado.",
    "Aversión, donde el alma se desvanece.",
    "Atávico, el eco de lo ancestral se alza.",
    "Anacrónico, el tiempo se dobla y se quiebra.",
    "Anodino, el vacío de lo que no se dice.",
    "Balcanizados, fragmentos dispersos de un ser roto.",
    "Bucólica, la imagen que se borra en la niebla.",
    "Carmín, el color del dolor que se consume.",
    "Conspicuos, sombras brillantes que perforan la negrura.",
    "Clivajes, heridas que nunca sanan.",
    "Cimarronaje, la rebelión de lo perdido.",
    "Cristalizadas, las palabras se congelan en el aire.",
    "Desdén, la mirada vacía hacia la distancia.",
    "Desgarbado, el cuerpo que se descompone en el gesto.",
    "Desidia, la inercia que ahoga el sentido.",
    "Desmembrar, romper las cadenas del ser.",
    "Desgajar, el alma que se fragmenta en su búsqueda.",
    "Desasosiego, un vacío que se expande sin fin.",
    "Díscolo, la mente que se niega a seguir el camino.",
    "Dislocado, el mundo que pierde su centro.",
    "Digresión, la deriva en un mar de palabras.",
    "Desollar, quitar la capa que oculta la verdad.",
    "Desafección, el desapego que vacía el corazón.",
    "Dislates, ideas que explotan en su caos.",
    "Diafana, una luz que se filtra a través de lo oscuro.",
    "Exhumar, lo enterrado que regresa a la vida.",
    "Endeble, la fragilidad de lo que permanece.",
    "Estuario, la confluencia de aguas turvas.",
    "Escaramuzas, las batallas sin fin que libramos.",
    "Estulticia, la ignorancia que crece como una sombra.",
    "Espurios, los ecos falsos que nos rodean.",
    "Escindido, lo roto que busca integrarse.",
    "Estertores, el último aliento de lo que se va.",
    "Esperpentos, figuras distorsionadas que cruzan la visión.",
    "Eclosión, el estallido de lo que estaba guardado.",
    "Entelequia, un sueño de lo que aún no es.",
    "Epifanía, la revelación que llega en la oscuridad.",
    "Exégesis, la interpretación del lenguaje sagrado.",
    "Fulgor, el resplandor que quema el alma.",
    "Fagocitado, devorado por el tiempo y el olvido.",
    "Filamentos, hilos de luz que se entrelazan.",
    "Filigrana, la delicadeza de lo que se pierde en el aire.",
    "Fratricidio, la traición más dolorosa.",
    "Fortuito, lo que surge sin previo aviso.",
    "Furibunda, la ira que arrastra todo a su paso.",
    "Hendiduras, las grietas que marcan el cuerpo.",
    "Ignominia, la vergüenza que nos consume.",
    "Imbricado, lo que se entrelaza en un destino común.",
    "Improperios, las palabras que hieren como espinas.",
    "Intersticios, los huecos que dejan las ausencias.",
    "Intempestivo, lo que llega cuando menos se espera.",
    "Inusitada, la sorpresa de lo inesperado.",
    "Insular, aislados en nuestra propia isla.",
    "Inasible, lo que se escapa entre los dedos.",
    "Inefable, lo que no se puede decir.",
    "Indolente, el corazón que ya no siente.",
    "Irascible, el fuego que arde sin razón.",
    "Iracundo, el enojo que consume todo a su paso.",
    "Insondable, el abismo que no tiene fin.",
    "Lacónico, las palabras que no dicen nada, pero lo dicen todo.",
    "Lacerante, el dolor que rasga el alma.",
    "Lasciva, la tentación que nos arrastra.",
    "Madriguera, el refugio que se convierte en cárcel.",
    "Miscelánea, el caos que se mezcla con lo ordenado.",
    "Metabolizar, asimilar lo que ya no podemos dejar ir.",
    "Moléculas, las partículas que componen todo lo que somos.",
    "Obstinado, el deseo que no se detiene.",
    "Ominoso, el presagio de lo que está por venir.",
    "Orfandad, la soledad que queda cuando todo se pierde.",
    "Ostracismo, el aislamiento forzoso del ser.",
    "Oprobio, la vergüenza pública que nos marca.",
    "Performativo, el acto que crea la realidad.",
    "Petricor, el olor a tierra mojada que despierta la memoria.",
    "Pueriles, las voces que claman desde la infancia.",
    "Plexo, el entrelazamiento de todos los nervios.",
    "Pliegues, los dobleces que guardan los secretos.",
    "Prerrogativas, los derechos que se conceden o se quitan.",
    "Pristina, la pureza que ha sido olvidada.",
    "Probidad, la honestidad que resiste la tentación.",
    "Rufianes, los que nos roban el alma sin mirarnos.",
    "Sedimentar, lo que queda cuando todo lo demás se ha ido.",
    "Subyugado, el ser que se rinde a su destino.",
    "Subterfugios, las mentiras que nos protegen y nos destruyen.",
    "Subrepticiamente, lo que se desliza sin que lo veamos.",
    "Zozobra, la ansiedad que nos consume.",
    "Sórdido, el mundo sucio que tratamos de ocultar.",
    "Supino, el descanso que no llega.",
    "Tensionar, el hilo que se estira hasta romperse.",
    "Telúricos, los ecos que resuenan en lo profundo de la tierra.",
    "Tórrido, el calor que nos quema por dentro.",
    "Ultrajante, lo que nos hiere sin piedad.",
    "Ubicua, la presencia que lo abarca todo.",
    "Urdimbre, el tejido de nuestras vidas entrelazadas.",
    "Vacuidad, el vacío que llena cada rincón.",
    "Vanidad, la ilusión que nos hace creer que somos todo."
  ];

  let grid = [];
  let cols, rows;
  let cellSize = 100;

  p.setup = function () {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("sketchPortadaPoesia");
    p.textFont("Helvetica");
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();

    cols = p.floor(p.width / cellSize);
    rows = p.floor(p.height / cellSize);

    let shuffled = p.shuffle(versos);
    let total = cols * rows;
    for (let i = 0; i < total; i++) {
      grid.push({
        x: (i % cols) * cellSize,
        y: p.floor(i / cols) * cellSize,
        texto: shuffled[i % shuffled.length]
      });
    }
  };

  p.draw = function () {
    p.background(255);
    p.fill(0);
    p.textSize(12);

    for (let i = 0; i < grid.length; i++) {
      let c = grid[i];
      let d = p.dist(p.mouseX, p.mouseY, c.x + cellSize / 2, c.y + cellSize / 2);

      if (d < cellSize / 2) {
        p.fill(0);
        p.textSize(14);
        p.textWrap(p.WORD);
        p.text(c.texto, c.x + 5, c.y + 5, cellSize - 10);
      } else {
        p.fill(0);
        p.textSize(24);
        p.text("▒", c.x + cellSize / 2, c.y + cellSize / 2);
      }
    }
  };
}

new p5(sketchPortadaPoesia);




/// FLUIDO REACTIVO
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

  rect(-width / 2, -height / 2, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

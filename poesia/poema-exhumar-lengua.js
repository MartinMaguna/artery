//BORRADOR EXHUMAR LENGUA

function sketchPortadaPoesia(p) {
    let abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    let versosPorLetra = {};
    let letras = [];
    let versosActivos = [];
    let letraResaltada = null;
  
    let tiempoEntreCaracteres = 80; // velocidad de tipeo
    let fuente;
  
    const versos = [
      "Bajo la lluvia, la memoria baila.",
      "Canta el río canciones que no olvido.",
      "Duerme el viento en los tejados viejos.",
      "El tiempo sopla entre las hojas secas.",
      "Fui jardín antes de ser ceniza.",
      "Gritan las piedras bajo los pasos.",
      "Hablan los muros en lenguas rotas.",
      "Invisible es el perfume de la infancia.",
      "Juegan las sombras a ser recuerdos.",
      "Karma de luz entre los dedos.",
      "Laten las estrellas con voz propia.",
      "Muere el día en un verso dormido.",
      "Nace la noche en tus pupilas.",
      "Olvida el mar su nombre en la arena.",
      "Pasan los trenes, quedan los ecos.",
      "Quiebra el alba la noche muda.",
      "Ruge el cielo sin testigos.",
      "Susurra el fuego su secreto.",
      "Tiemblan los nombres en los labios.",
      "Un verso basta para despertar.",
      "Vuelve la lluvia a escribirnos.",
      "Waltz de hojas bajo el farol.",
      "Xilófonos suenan en sueños raros.",
      "Yace la voz en la garganta ajena.",
      "Zarpa el silencio en barco de tinta."
    ];
  
    p.setup = function () {
      const containerWidth = document.getElementById('sketchPortadaPoesia').offsetWidth;
      let canvas = p.createCanvas(containerWidth, 500);
      canvas.parent('sketchPortadaPoesia');
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont('Courier Prime');
      p.noStroke();
      p.ellipseMode(p.CENTER);
  
      // Crear letras
      for (let i = 0; i < abecedario.length; i++) {
        let letra = abecedario[i];
        letras.push({
          letra,
          x: p.random(80, p.width - 80),
          y: p.random(80, p.height - 80),
          latidoFase: p.random(p.TWO_PI),
          indiceVerso: 0
        });
  
        versosPorLetra[letra] = [versos[i]]; // 1 verso por letra
      }
    };
  
    p.draw = function () {
      p.background(0);
      letraResaltada = null;
  
      // Conectar letras con líneas tenues como constelación
      p.stroke(255, 20);
      for (let i = 0; i < letras.length; i++) {
        for (let j = i + 1; j < letras.length; j++) {
          p.line(letras[i].x, letras[i].y, letras[j].x, letras[j].y);
        }
      }
      p.noStroke();
  
      // Detectar si el mouse está sobre una letra
      for (let l of letras) {
        if (p.dist(p.mouseX, p.mouseY, l.x, l.y) < 22) {
          letraResaltada = l;
          break;
        }
      }
  
      // Dibujar letras como teclas que laten
      for (let l of letras) {
        let tiempo = p.millis() / 500 + l.latidoFase;
        let escala = 1 + 0.1 * Math.sin(tiempo);
        let opacidad = (letraResaltada && letraResaltada !== l) ? 40 : 255;
  
        // Círculo tipo tecla
        p.fill(255, opacidad);
        p.ellipse(l.x, l.y, 40 * escala);
        p.textSize(16 * escala);
        p.fill(0);
        p.text(l.letra, l.x, l.y);
      }
  
      // Mostrar versos activos letra por letra
      for (let i = versosActivos.length - 1; i >= 0; i--) {
        let verso = versosActivos[i];
        let tiempoTranscurrido = p.millis() - verso.tiempoInicio;
        let numCaracteres = Math.floor(tiempoTranscurrido / tiempoEntreCaracteres);
        let textoVisible = verso.texto.substring(0, numCaracteres);
  
        p.fill(255);
        p.textSize(18);
        p.textAlign(p.LEFT, p.TOP);
        p.text(textoVisible, verso.x, verso.y);
  
        if (numCaracteres >= verso.texto.length) {
          verso.completado = true;
        }
      }
  
      versosActivos = versosActivos.filter(v => !v.completado);
    };
  
    p.mousePressed = function () {
      if (letraResaltada) {
        let letra = letraResaltada.letra;
        let indice = letraResaltada.indiceVerso;
        let versos = versosPorLetra[letra];
  
        if (versos && versos.length > 0) {
          let texto = versos[indice % versos.length];
          versosActivos.push({
            texto: texto,
            tiempoInicio: p.millis(),
            x: letraResaltada.x + 25,
            y: letraResaltada.y,
            completado: false
          });
          letraResaltada.indiceVerso++;
        }
      }
    };
  }
  
  new p5(sketchPortadaPoesia);
  
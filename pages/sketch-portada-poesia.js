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

    let versoActual = "";
    let textoMostrado = "";
    let textoIndex = 0;
    let tiempoTecla = 100;
    let ultimoTiempo = 0;
  
    let cursorVisible = true;
    let tiempoCursor = 0;
  
    let posX = 0;
    let posY = 0;
  
    p.setup = function () {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent("sketchPortadaPoesia");
  
      p.textFont("Helvetica"); // Letra más clara de sistema
      p.textAlign(p.LEFT, p.TOP);
      p.fill(255);
      p.cursor(p.TEXT);
      p.frameRate(60); // Mejor control del tiempo
    };
  
    p.draw = function () {
      p.background(0);
  
      // Animar escritura
      if (versoActual && textoIndex < versoActual.length) {
        const ahora = p.millis();
        if (ahora - ultimoTiempo > tiempoTecla) {
          textoMostrado += versoActual[textoIndex];
          textoIndex++;
          ultimoTiempo = ahora;
        }
      }
  
      mostrarVerso();
      mostrarCursorParpadeante();
    };
  
    p.mousePressed = function () {
      const nuevoVerso = versos[p.floor(p.random(versos.length))];
      if (nuevoVerso !== versoActual) {
        versoActual = nuevoVerso;
        textoMostrado = "";
        textoIndex = 0;
        ultimoTiempo = p.millis();
        posX = p.mouseX;
        posY = p.mouseY;
      }
    };
  
    function mostrarVerso() {
      if (textoMostrado !== "") {
        p.fill(255, 240);
        p.textSize(p.min(p.width, p.height) * 0.035); // Tamaño mayor para legibilidad
        p.text(textoMostrado, posX, posY, p.width - posX - 20); // Permite salto de línea
      }
    }
  
    function mostrarCursorParpadeante() {
      const ahora = p.millis();
      if (ahora - tiempoCursor > 500) {
        cursorVisible = !cursorVisible;
        tiempoCursor = ahora;
      }
  
      if (cursorVisible && textoMostrado !== "") {
        const cursorX = posX + p.textWidth(textoMostrado);
        const cursorY = posY;
        p.stroke(255);
        p.strokeWeight(2);
        p.line(cursorX, cursorY, cursorX, cursorY + p.textSize());
      }
    }
  }
  
  new p5(sketchPortadaPoesia);
  
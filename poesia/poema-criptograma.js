let vitruvio = [
  "Cuatro dedos hacen una palma.",
  "Cuatro palmas hacen un pie.",
  "Seis palmas hacen un codo.",
  "Cuatro codos hacen la altura del hombre.",
  "Cuatro codos hacen un paso.",
  "Veinticuatro palmas hacen un hombre.",
  "La longitud de los brazos extendidos de un hombre es igual a su altura.",
  "Desde el nacimiento del pelo hasta la punta de la barbilla es la décima parte de la altura de un hombre.",
  "Desde la punta de la barbilla a la parte superior de la cabeza es un octavo de su estatura.",
  "Desde la parte superior del pecho al extremo de su cabeza será el sexto de un hombre.",
  "Desde la parte superior del pecho al nacimiento del pelo será la séptima parte del hombre.",
  "Desde los pezones a la parte de arriba de la cabeza será la cuarta parte del hombre."
];

let abisal = [
  "Sumergido en oscuridad viscosa,",
  "sólo escucho mi corazón,",
  "y el canto mineral del fondo",
  "entre criaturas que nunca han visto el sol.",
  "Mis huesos vibran con la marea",
  "y mis ojos se abren sin mirar.",
  "Soy un eco en la caverna líquida,",
  "un pensamiento que se disuelve en sal.",
  "Me hundo, me disuelvo,",
  "hasta no ser más que agua que recuerda."
];

let allVerses = [];
let vitruvioSound;
let currentLine = 0;
let currentText = "";
let typingSpeed = 4;

let filter, delay, reverb, distortion;
let muteButton;
let isMuted = false;

function preload() {
  vitruvioSound = loadSound('../asset/vitruvio.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(20);
  textAlign(CENTER, CENTER);
  frameRate(30);

  allVerses = [...vitruvio, ...abisal];

  // Efectos
  filter = new p5.BandPass();
  delay = new p5.Delay();
  reverb = new p5.Reverb();
  distortion = new p5.Distortion();

  vitruvioSound.disconnect();
  vitruvioSound.connect(filter);
  filter.connect(delay);
  delay.process(filter, 0.25, 0.3, 2300);
  reverb.process(filter, 2, 1);
  distortion.process(filter, 0.05);

  vitruvioSound.setVolume(0.6);
  vitruvioSound.loop();

  // Crear botón
  muteButton = createButton('🔈 Silenciar audio');
  muteButton.position(windowWidth / 2 - 100, windowHeight - 60);
  muteButton.size(200, 40);
  styleButton(muteButton);
  muteButton.mousePressed(toggleMute);
}

function draw() {
  background(255);
  fill(0);

  // Efectos sutiles según posición del cursor
  let distFromCenter = abs(mouseX - width / 2) / (width / 2);
  let freq = map(distFromCenter, 0, 1, 400, 1000); // rango limitado
  let res = map(distFromCenter, 0, 1, 5, 20);
  let delayTime = map(distFromCenter, 0, 1, 0.15, 0.35);
  let feedback = map(distFromCenter, 0, 1, 0.1, 0.4);
  let distortionAmount = map(distFromCenter, 0, 1, 0.01, 0.15);

  filter.freq(freq);
  filter.res(res);
  delay.delayTime(delayTime);
  delay.feedback(feedback);
  distortion.set(distortionAmount);

  // Mostrar versos
  let lineHeight = 36;
  let yOffset = height / 2 - (lineHeight * allVerses.length) / 2;

  for (let i = 0; i < currentLine; i++) {
    text(allVerses[i], width / 2, yOffset + i * lineHeight);
  }

  if (frameCount % typingSpeed === 0 && currentText.length < allVerses[currentLine].length) {
    currentText += allVerses[currentLine].charAt(currentText.length);
  }

  text(currentText, width / 2, yOffset + currentLine * lineHeight);

  if (currentText.length === allVerses[currentLine].length && currentLine < allVerses.length - 1) {
    currentLine++;
    currentText = "";
  }

  if (currentLine >= allVerses.length) {
    noLoop();
  }

  // Reubicar botón por si cambia el tamaño
  muteButton.position(windowWidth / 2 - 100, windowHeight - 60);
}

function toggleMute() {
  isMuted = !isMuted;
  vitruvioSound.setVolume(isMuted ? 0 : 0.6);
  muteButton.html(isMuted ? '🔇 Activar audio' : '🔈 Silenciar audio');
}

function styleButton(btn) {
  btn.style('font-size', '16px');
  btn.style('background-color', '#222');
  btn.style('color', '#fff');
  btn.style('border', 'none');
  btn.style('border-radius', '8px');
  btn.style('cursor', 'pointer');
  btn.style('box-shadow', '0 4px 10px rgba(0,0,0,0.3)');
  btn.style('transition', 'all 0.2s ease');
  btn.mouseOver(() => btn.style('background-color', '#444'));
  btn.mouseOut(() => btn.style('background-color', '#222'));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

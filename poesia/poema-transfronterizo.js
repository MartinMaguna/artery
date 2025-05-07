let audioBase, audioArgentina, audioUruguay, audioBrasil;
let amp;

function preload() {
  audioBase = loadSound('../asset/poeticastransfronterizas.mp3');
  audioArgentina = loadSound('../asset/Argentina_Zamba_70bpm.mp3');
  audioUruguay = loadSound('../asset/Uruguay_Candombe_70bpm.mp3');
  audioBrasil = loadSound('../asset/Brasil_Forro_70bpm.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  amp = new p5.Amplitude();

  // Reproducción en loop y volúmenes iniciales
  [audioBase, audioArgentina, audioUruguay, audioBrasil].forEach(audio => {
    audio.loop();
    audio.setVolume(0);
  });

  audioBase.setVolume(0.6);
}

function draw() {
  background(0);
  orbitControl(); // permite rotar con mouse

  let level = amp.getLevel();
  let deform = map(level, 0, 0.3, 0, 50);

  rotateY(millis() / 4000);
  rotateX(millis() / 6000);

  noStroke();
  fill(255); // esfera blanca

  // Esfera reactiva al sonido
  beginShape(TRIANGLES);
  let detail = 100;
  for (let i = 0; i < detail; i++) {
    let theta = map(i, 0, detail, 0, PI);
    for (let j = 0; j < detail; j++) {
      let phi = map(j, 0, detail, 0, TWO_PI);

      let r = 150 + noise(i * 0.1, j * 0.1, frameCount * 0.01) * deform;
      let x = r * sin(theta) * cos(phi);
      let y = r * sin(theta) * sin(phi);
      let z = r * cos(theta);

      vertex(x, y, z);
    }
  }
  endShape();

  // Sonido direccional según ángulo del puntero
  let angle = atan2(mouseY - height / 2, mouseX - width / 2);
  let distMouse = dist(mouseX, mouseY, width / 2, height / 2);
  let vol = map(distMouse, 0, width / 2, 0.7, 0.1, true);

  audioBase.setVolume(lerp(audioBase.getVolume(), vol, 0.05));
  audioArgentina.setVolume(lerp(audioArgentina.getVolume(), angle > 0 ? vol : 0, 0.05));
  audioUruguay.setVolume(lerp(audioUruguay.getVolume(), abs(angle) < PI / 4 ? vol : 0, 0.05));
  audioBrasil.setVolume(lerp(audioBrasil.getVolume(), angle < 0 ? vol : 0, 0.05));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

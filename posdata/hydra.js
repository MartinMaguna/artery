// ---- Hydra ----
const hydra = new Hydra({
  detectAudio: false,
  canvas: document.createElement("canvas"),
  enableStreamCapture: false,
});
hydra.canvas.style.position = "absolute";
hydra.canvas.style.top = "0";
hydra.canvas.style.left = "0";
hydra.canvas.style.zIndex = "-1";
document.body.appendChild(hydra.canvas);

// ---- Tone.js ----
Tone.Transport.bpm.value = 85;

const kick = new Tone.MembraneSynth().toDestination();
const lead = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 1 },
}).toDestination();

const reverb = new Tone.Reverb({ decay: 3, wet: 0.5 }).toDestination();
lead.connect(reverb);

// Análisis
const analyser = new Tone.Analyser("waveform", 64);
reverb.connect(analyser);

// Generar notas estocásticas
const scale = ["C4", "D4", "E4", "G4", "A4", "B4"];
function getRandomNote() {
  return Math.random() < 0.8 ? scale[Math.floor(Math.random() * scale.length)] : null;
}

// Secuencias
const melody = new Tone.Loop((time) => {
  const note = getRandomNote();
  if (note) {
    lead.triggerAttackRelease(note, ["8n", "16n"][Math.floor(Math.random() * 2)], time);
  }
}, "8n");

const beat = new Tone.Loop((time) => {
  if (Math.random() > 0.2) {
    kick.triggerAttackRelease("C2", "8n", time);
  }
}, "4n");

// Iniciar audio
Tone.Transport.start();
melody.start(0);
beat.start(0);

// ---- Hydra Visual con feedback + imagen ----
s0.initImage("../asset/arteria_logo.png");

src(s0)
  .scale(() => 1 + Math.sin(time) * 0.03)
  .modulate(osc(4, 0.1, 0.8), () => 0.05 + amplitude * 0.2)
  .colorama(() => 0.05 + amplitude * 0.2)
  .out(o0);

src(o0)
  .blend(src(s0).scale(1.02), () => 0.2 + amplitude * 0.3)
  .modulate(noise(3).scale(0.5), 0.05)
  .contrast(1.2)
  .out();

// ---- P5.js ----
let amplitude = 0;

function getAmplitude() {
  const values = analyser.getValue();
  return values.reduce((acc, v) => acc + Math.abs(v), 0) / values.length;
}

new p5((p) => {
  p.setup = () => {
    let cnv = p.createCanvas(window.innerWidth, window.innerHeight);
    cnv.style("position", "absolute");
    cnv.style("z-index", "0");
    cnv.style("pointer-events", "none");
    p.noFill();
    p.strokeWeight(2);
  };

  p.draw = () => {
    p.clear();
    amplitude = getAmplitude();

    const waveform = analyser.getValue();
    p.stroke(255, 100);
    p.beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = p.map(i, 0, waveform.length, 0, p.width);
      let y = p.map(waveform[i], -1, 1, 0, p.height);
      p.vertex(x, y);
    }
    p.endShape();

    // Círculos pulsantes con amplitud
    p.noStroke();
    p.fill(255, 150, 150, 150);
    const size = 100 + amplitude * 500;
    p.ellipse(p.width / 2, p.height / 2, size, size);
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
});

// ---- Iniciar audio al hacer clic ----
document.body.addEventListener("click", async () => {
  await Tone.start();
  console.log("Audio iniciado");
});

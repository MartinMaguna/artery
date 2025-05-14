let palabras = [
  "Para", "hacer", "un", "poema", "dadaísta", "coge", "un", "periódico", "unas", "tijeras",
  "y", "escoge", "un", "artículo", "de", "longitud", "similar", "al", "poema", "que",
  "quieras", "hacer", "Recorta", "el", "artículo", "Después", "recorta", "todas", "las",
  "palabras", "que", "lo", "conforman", "e", "introdúcelas", "en", "una", "bolsa",
  "Agítala", "suavemente", "A", "continuación", "coge", "cada", "una", "de", "ellas",
  "y", "colócalas", "una", "tras", "otra", "en", "el", "mismo", "orden", "en", "el",
  "que", "salieron", "de", "la", "bolsa", "Cópialas", "concienzudamente", "El",
  "poema", "te", "definirá", "como", "eres", "Aquí", "estás", "convertido", "en",
  "todo", "un", "escritor", "Original", "hasta", "el", "infinito", "y", "dotado", "de",
  "una", "encantadora", "sensibilidad", "aunque", "incomprendido", "por", "los", "ignorantes"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noLoop();
}

function draw() {}

function generarPoema() {
  clear();
  background(255);

  const palabrasMezcladas = RiTa.shuffle(palabras);

  let texto = palabrasMezcladas.join(" ");
  document.getElementById("poemaTexto").innerText = texto;

  // Visualización con estilo "palabras recortadas"
  for (let i = 0; i < palabrasMezcladas.length; i++) {
    let x = random(width);
    let y = random(height);
    let rot = random(-PI / 6, PI / 6);
    let size = random(16, 32);

    push();
    translate(x, y);
    rotate(rot);
    textSize(size);
    fill(random(50, 200));
    text(palabrasMezcladas[i], 0, 0);
    pop();
  }
}

const poemaContainer = document.querySelector('.poema_pulso');

// Array de versos (con líneas vacías para los espacios)
const versos = [
  "flujo de datos",
  "textos, imágenes, sonidos",
  "código, música, vídeos,",
  "poesía",
  "",
  "archivos sensibles",
  "arteria en la red de redes.",
  "arte algorítmico, generativo",
  "dossier genético",
  "acopio sensible en un dataset",
  "",
  "vemödalen",
  "",
  "estética de la complejidad",
  "caos, cosmos",
  "urdimbre",
  "colmena",
  "poesía",
  "",
  "textos y textiles",
  "bordado tecno-poético colectivo",
  "filigrana de estaño",
  "sobre placas",
  "que tiemblan",
  "y se sienten",
  "arte, cuerpo, red",
  "una arteria",
  "que pulsa",
  "poesía"
];

// Función para mezclar versos (algoritmo Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Función para renderizar los versos
function renderPoema(versosArray) {
  poemaContainer.innerHTML = versosArray.map(v => v ? `<p>${v}</p>` : `<br>`).join('');
  poemaContainer.appendChild(btn); // aseguramos que el botón quede al final
}

// Crear el botón de regeneración
const btn = document.createElement('button');
btn.textContent = "Regenerar poema";
btn.classList.add('btn-regenerar');
btn.addEventListener('click', () => {
  const versosMezclados = shuffle([...versos]); // clonamos antes de mezclar
  renderPoema(versosMezclados);
});

// Render inicial (orden original)
renderPoema(versos);

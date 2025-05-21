import { db, collection, addDoc, onSnapshot, query, orderBy, getDocs } from '../firebase.js';

// Referencia a la colección de versos
const versosRef = collection(db, 'versosUPM');

// Elementos del DOM
const poemEl = document.getElementById('poem');
const communityPoemEl = document.getElementById('communityPoem');
const userVerseEl = document.getElementById('userVerse');
const submitVerseBtn = document.getElementById('submitVerse');
const generateBtn = document.getElementById('generate');

// Función generativa a partir de versos reales
async function generarPoema() {
  const r = RiTa;
  try {
    const snapshot = await getDocs(query(versosRef, orderBy('timestamp', 'desc')));
    const versos = snapshot.docs.map(doc => doc.data().texto);

    if (versos.length === 0) {
      poemEl.innerHTML = '<p>No hay versos aún. ¡Sé el primero en contribuir!</p>';
      return;
    }

    // Ejemplo simple: tomar versos al azar y hacer algo con ellos
    const versosAleatorios = shuffleArray(versos).slice(0, 4);
    const poemaProcesado = versosAleatorios.map(v => {
      // Ejemplo: cortar en palabras y recombinar
      const palabras = r.tokenize(v);
      const nuevaLinea = palabras.slice(0, 3).join(' ') + r.randomWord({ pos: 'jj' });
      return r.capitalize(nuevaLinea);
    });

    poemEl.innerHTML = poemaProcesado.map(v => `<p>${v}</p>`).join('');
  } catch (e) {
    console.error('Error generando poema:', e);
    poemEl.innerHTML = '<p>Error generando el poema.</p>';
  }
}

// Enviar verso del usuario
submitVerseBtn.addEventListener('click', async () => {
  const texto = userVerseEl.value.trim();
  if (!texto) return;

  try {
    await addDoc(versosRef, {
      texto,
      timestamp: new Date()
    });
    userVerseEl.value = '';
  } catch (e) {
    console.error('Error al enviar el verso:', e);
  }
});

// Escuchar versos en tiempo real y mostrarlos en comunidad
const q = query(versosRef, orderBy('timestamp', 'desc'));

onSnapshot(q, snapshot => {
  communityPoemEl.innerHTML = '';
  snapshot.forEach(doc => {
    const verso = doc.data().texto;
    const p = document.createElement('p');
    p.textContent = verso;
    communityPoemEl.appendChild(p);
  });
});

// Función para mezclar un array (Fisher-Yates)
function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generar poema al cargar y al hacer clic
window.addEventListener('DOMContentLoaded', generarPoema);
generateBtn.addEventListener('click', generarPoema);

import {
  db,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from './firebase-config.js';

const acrosticForm = document.getElementById('acrosticForm');
const mensajeElement = document.getElementById('mensaje');
const pagesContainer = document.querySelector('.pages');
const prevBtn = document.querySelector('.page-nav.prev');
const nextBtn = document.querySelector('.page-nav.next');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');

let versosColaborativos = [];
let paginasGeneradas = [];
let currentPage = 0;
const versosPorPagina = 3;

const portada = document.getElementById('page-0');
const formPage = document.getElementById('page-form');
const finalPage = document.getElementById('page-final');

const todasLasPaginasEstaticas = [portada, finalPage, formPage];

// 🔄 Escucha los cambios en tiempo real desde Firestore
const q = query(collection(db, 'versosUPM'), orderBy('timestamp', 'asc'));
onSnapshot(q, (snapshot) => {
  versosColaborativos = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    const versoCompleto = data.versoCompleto;
    if (typeof versoCompleto === 'string' && versoCompleto.trim() !== '') {
      versosColaborativos.push(versoCompleto);
    }
  });
  generarPaginasPoema();
  mostrarPagina(0);
});

// ➕ Enviar nuevos versos como un solo documento
acrosticForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const lineU = document.getElementById('lineU').value.trim();
  const lineP = document.getElementById('lineP').value.trim();
  const lineM = document.getElementById('lineM').value.trim();

  // Permitir solo U o Ú mayúscula
  if (!/^([UÚ])/.test(lineU)) return mostrarMensaje('El primer verso debe comenzar con U', 'error');
  if (!lineP.startsWith('P')) return mostrarMensaje('El segundo verso debe comenzar con P', 'error');
  if (!lineM.startsWith('M')) return mostrarMensaje('El tercer verso debe comenzar con M', 'error');

  const versoCompleto = `${lineU} ${lineP} ${lineM}`;

  try {
    await addDoc(collection(db, 'versosUPM'), {
      versoCompleto: versoCompleto,
      palabras: { U: lineU, P: lineP, M: lineM },
      timestamp: serverTimestamp()
    });

    acrosticForm.reset();
    mostrarMensaje('¡Versos enviados correctamente!', 'success');
  } catch (error) {
    console.error(error);
    mostrarMensaje('Error al guardar los versos. Inténtalo de nuevo.', 'error');
  }
});

function mostrarMensaje(texto, tipo) {
  mensajeElement.textContent = texto;
  mensajeElement.className = tipo;
  setTimeout(() => {
    mensajeElement.textContent = '';
    mensajeElement.className = '';
  }, 4000);
}

// 🧱 Generar páginas dinámicamente
function generarPaginasPoema() {
  // Eliminar páginas generadas previamente
  paginasGeneradas.forEach(p => p.remove());
  paginasGeneradas = [];

  for (let i = 0; i < versosColaborativos.length; i += versosPorPagina) {
    const page = document.createElement('div');
    page.className = 'page poema';
    page.setAttribute('aria-hidden', 'true');
    page.setAttribute('tabindex', '-1');
    const pageContent = document.createElement('div');
    pageContent.className = 'page-content';

    versosColaborativos.slice(i, i + versosPorPagina).forEach(verso => {
      const p = document.createElement('p');
      p.textContent = verso;
      pageContent.appendChild(p);
    });

    const pageNumber = document.createElement('div');
    pageNumber.className = 'page-number';
    pageNumber.textContent = Math.floor(i / versosPorPagina) + 1;

    page.appendChild(pageContent);
    page.appendChild(pageNumber);

    // Insertar antes de la página final
    pagesContainer.insertBefore(page, finalPage);
    paginasGeneradas.push(page);
  }

  // Total de páginas: portada (1) + dinámicas + final (1) + formulario (1)
  const total = 1 + paginasGeneradas.length + 2;
  totalPagesSpan.textContent = total;
}

// 🧭 Mostrar página activa por índice
function mostrarPagina(idx) {
  const allPages = [portada, ...paginasGeneradas, finalPage, formPage];

  allPages.forEach((page, i) => {
    if (i === idx) {
      page.classList.add('active');
      page.setAttribute('aria-hidden', 'false');
      page.setAttribute('tabindex', '0');
    } else {
      page.classList.remove('active');
      page.setAttribute('aria-hidden', 'true');
      page.setAttribute('tabindex', '-1');
    }
  });

  currentPage = idx;
  currentPageSpan.textContent = idx + 1;
  nextBtn.disabled = currentPage >= allPages.length - 1;
  prevBtn.disabled = currentPage <= 0;
}

// ⬅️➡️ Navegación
prevBtn.addEventListener('click', () => {
  if (currentPage > 0) mostrarPagina(currentPage - 1);
});

nextBtn.addEventListener('click', () => {
  const total = 1 + paginasGeneradas.length + 2;
  if (currentPage < total - 1) mostrarPagina(currentPage + 1);
});

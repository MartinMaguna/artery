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
let currentPage = 0;
let versosPorPagina = 3;
let paginasGeneradas = [];

// Recuperar versos en tiempo real de Firestore
const q = query(collection(db, 'versosUPM'), orderBy('timestamp', 'asc'));
onSnapshot(q, (snapshot) => {
  versosColaborativos = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    const verso = data.verso;
    if (typeof verso === 'string' && verso.trim() !== '') {
      versosColaborativos.push(verso);
    }
  });
  generarPaginasPoema();
  mostrarPagina(0);
});

// Enviar nuevos versos a Firestore
acrosticForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const lineU = document.getElementById('lineU').value.trim();
  const lineP = document.getElementById('lineP').value.trim();
  const lineM = document.getElementById('lineM').value.trim();

  if (!lineU.toUpperCase().startsWith('U')) {
    mostrarMensaje('El primer verso debe comenzar con U', 'error');
    return;
  }
  if (!lineP.toUpperCase().startsWith('P')) {
    mostrarMensaje('El segundo verso debe comenzar con P', 'error');
    return;
  }
  if (!lineM.toUpperCase().startsWith('M')) {
    mostrarMensaje('El tercer verso debe comenzar con M', 'error');
    return;
  }

  try {
    await addDoc(collection(db, 'versosUPM'), {
      verso: lineU,
      letra: 'U',
      timestamp: serverTimestamp()
    });
    await addDoc(collection(db, 'versosUPM'), {
      verso: lineP,
      letra: 'P',
      timestamp: serverTimestamp()
    });
    await addDoc(collection(db, 'versosUPM'), {
      verso: lineM,
      letra: 'M',
      timestamp: serverTimestamp()
    });
    acrosticForm.reset();
    mostrarMensaje('¡Versos enviados correctamente!', 'success');
  } catch (error) {
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

function generarPaginasPoema() {
  // Elimina todas las páginas generadas dinámicamente excepto portada, formulario y final
  const portada = document.getElementById('page-0');
  const formPage = document.getElementById('page-form');
  const finalPage = document.getElementById('page-final');
  // Elimina todas las páginas intermedias
  document.querySelectorAll('.page.poema').forEach(p => p.remove());

  paginasGeneradas = [];
  for (let i = 0; i < versosColaborativos.length; i += versosPorPagina) {
    const versosPagina = versosColaborativos.slice(i, i + versosPorPagina);
    const pageNum = paginasGeneradas.length + 1;
    const page = document.createElement('div');
    page.className = 'page poema';
    page.id = `page-poema-${pageNum}`;
    const content = document.createElement('div');
    content.className = 'page-content';
    versosPagina.forEach(v => {
      const p = document.createElement('p');
      p.textContent = v;
      content.appendChild(p);
    });
    page.appendChild(content);
    const num = document.createElement('div');
    num.className = 'page-number';
    num.textContent = pageNum;
    page.appendChild(num);
    // Insertar antes de la página final y formulario
    pagesContainer.insertBefore(page, formPage);
    paginasGeneradas.push(page);
  }
  // Actualizar total de páginas
  const total = 1 + paginasGeneradas.length + 2; // portada + poema + form + final
  totalPagesSpan.textContent = total;
}

function mostrarPagina(idx) {
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(p => p.classList.remove('active'));
  // portada = 0, luego poema, luego form, luego final
  let pageToShow;
  if (idx === 0) {
    pageToShow = document.getElementById('page-0');
  } else if (idx > 0 && idx <= paginasGeneradas.length) {
    pageToShow = paginasGeneradas[idx - 1];
  } else if (idx === paginasGeneradas.length + 1) {
    pageToShow = document.getElementById('page-form');
  } else {
    pageToShow = document.getElementById('page-final');
  }
  if (pageToShow) pageToShow.classList.add('active');
  currentPage = idx;
  currentPageSpan.textContent = idx + 1;
  // Botones
  prevBtn.style.display = currentPage === 0 ? 'none' : 'block';
  nextBtn.style.display = currentPage === (paginasGeneradas.length + 2) ? 'none' : 'block';
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 0) mostrarPagina(currentPage - 1);
});
nextBtn.addEventListener('click', () => {
  if (currentPage < paginasGeneradas.length + 2) mostrarPagina(currentPage + 1);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentPage > 0) {
    mostrarPagina(currentPage - 1);
  } else if (e.key === 'ArrowRight' && currentPage < paginasGeneradas.length + 2) {
    mostrarPagina(currentPage + 1);
  }
});
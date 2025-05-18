import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { app } from "/firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

const loginGoogleBtn = document.getElementById('login-google');
const logoutBtn = document.getElementById('logout');
const form = document.getElementById('verso-form');
const estadoAuth = document.getElementById('estado-auth');

loginGoogleBtn.addEventListener('click', async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error de inicio de sesión", error);
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    form.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    loginGoogleBtn.style.display = 'none';
    estadoAuth.textContent = `Bienvenido, ${user.displayName || user.email}`;
  } else {
    form.style.display = 'none';
    logoutBtn.style.display = 'none';
    loginGoogleBtn.style.display = 'inline-block';
    estadoAuth.textContent = "Por favor, iniciá sesión para participar.";
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const lineU = document.getElementById('line-u').value.trim();
  const lineP = document.getElementById('line-p').value.trim();
  const lineM = document.getElementById('line-m').value.trim();
  const user = auth.currentUser;

  if (!user) return alert("Necesitás estar autenticado.");

  if (!lineU.startsWith('U') || !lineP.startsWith('P') || !lineM.startsWith('M')) {
    alert("Cada línea debe comenzar con la letra correspondiente: U, P, M.");
    return;
  }

  try {
    await addDoc(collection(db, "versosUPM"), {
      uid: user.uid,
      autor: user.displayName || user.email,
      verso: {
        U: lineU,
        P: lineP,
        M: lineM
      },
      creado: serverTimestamp()
    });
    alert("¡Gracias por tu aporte al acróstico!");
    form.reset();
  } catch (error) {
    console.error("Error al guardar el verso:", error);
  }
});

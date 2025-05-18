// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"; // CORREGIDO

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDRUNxt9m8NoEzQJLyb9CF5F7oOgB5JyG8",
  authDomain: "arteria-62901.firebaseapp.com",
  projectId: "arteria-62901",
  storageBucket: "arteria-62901.appspot.com",
  messagingSenderId: "530161523000",
  appId: "1:530161523000:web:7b8e3315564be4abdfc9cd",
  measurementId: "G-JFB4R66Y77"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Exportar servicios
export {
  app,
  db,
  auth,
  googleProvider,
  collection,
  addDoc,
  getDocs,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};

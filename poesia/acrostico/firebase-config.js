// firebase-config.js
// Archivo de configuración y exportación de Firebase

// Importa los módulos necesarios de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Tu configuración de Firebase - Reemplaza con tus credenciales reales
// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDRUNxt9m8NoEzQJLyb9CF5F7oOgB5JyG8",
  authDomain: "arteria-62901.firebaseapp.com",
  projectId: "arteria-62901",
  storageBucket: "arteria-62901.appspot.com",
  messagingSenderId: "530161523000",
  appId: "1:530161523000:web:7b8e3315564be4abdfc9cd",
  measurementId: "G-JFB4R66Y77"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exporta lo que necesites
export { 
  db, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
};
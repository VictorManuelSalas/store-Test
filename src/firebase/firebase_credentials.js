// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseIntaller";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const auth = getAuth(app);

// Función que se ejecuta cuando el usuario inicia sesión
// const handleUserSignIn = (user) => {
//   console.log("Usuario ha iniciado sesión:", user);
//   // Aquí puedes hacer lo que necesites cuando el usuario inicie sesión
// };

// // Configura el observador de estado de autenticación
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     handleUserSignIn(user);
//   } else {
//     console.log("No hay usuario autenticado.", user);
//   }
// });

export { app };

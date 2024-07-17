// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./firebaseIntaller";

// const firebaseConfig = {

//     apiKey: "AIzaSyDgfgzsGLcLG12Rry2v5873_xwckV1M1kM",

//     authDomain: "smartstore-90c07.firebaseapp.com",

//     projectId: "smartstore-90c07",

//     storageBucket: "smartstore-90c07.appspot.com",

//     messagingSenderId: "369227442823",

//     appId: "1:369227442823:web:88222e6e07b7311f006622",

//     measurementId: "G-L3Q221XSQ8"

//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app };

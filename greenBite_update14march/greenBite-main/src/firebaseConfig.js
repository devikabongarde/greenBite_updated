// Import the functions you need from the SDKs

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"; // Removed duplicate getAuth import
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore"; // Firestore import, if needed elsewhere
import { getDatabase } from "firebase/database"; // Realtime Database import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJUrNLTrC4eUH7H1cOT-BxuMl2xvKKBeo",
  authDomain: "greenbite-254e4.firebaseapp.com",
  databaseURL: "https://greenbite-254e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "greenbite-254e4",
  storageBucket: "greenbite-254e4.firebasestorage.app",
  messagingSenderId: "188773355781",
  appId: "1:188773355781:web:4291fedd5a729b170ba76c"
};


// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // Authentication
export const functions = getFunctions(app); // Firebase Functions (if needed)
export const db = getFirestore(app); // Firestore (if needed)
export const database = getDatabase(app); // Realtime Database
export const provider = new GoogleAuthProvider(); // Google Auth

import firebase from "firebase/compat/app"; // Import the compat version of Firebase

import { getAuth } from "firebase/auth";
import "firebase/compat/firestore"; // Import Firestore compat
import "firebase/compat/auth"; // Import Auth compat
import "firebase/compat/storage"; // Import Storage compat (for product image uploads)

// Firebase config
// 👉 Replace the values below with YOUR OWN Firebase project's config
//    (Firebase console → Project settings → Your apps → SDK setup).
const firebaseConfig = {
  apiKey: "AIzaSyCmm2U0EcRuJYvLeU-8i168R1qoSl20_ME",
  authDomain: "clone-evangadi-2024.firebaseapp.com",
  projectId: "clone-evangadi-2024",
  storageBucket: "clone-evangadi-2024.appspot.com",
  messagingSenderId: "541618558773",
  appId: "1:541618558773:web:bb870fc732ace2cc951e7c",
};

// Initialize Firebase using the compat version
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app); // Authentication instance (used with modular auth functions)
export const db = firebase.firestore(); // Firestore database (compat API)
export const storage = firebase.storage(); // Cloud Storage (compat API) for image uploads

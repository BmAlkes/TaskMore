// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5DJwmB-iK3ikN4t5hNHUvh3PK37iSYJI",
  authDomain: "taskplus-e159e.firebaseapp.com",
  projectId: "taskplus-e159e",
  storageBucket: "taskplus-e159e.appspot.com",
  messagingSenderId: "955148252078",
  appId: "1:955148252078:web:dcb6a4ea31fb50eabbce3f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

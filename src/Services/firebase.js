import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc0_4jey2hXwcU0yVIAvQFLqFk7T8zY0U",
  authDomain: "teacher-booking-app-8a4ef.firebaseapp.com",
  projectId: "teacher-booking-app-8a4ef",
  storageBucket: "teacher-booking-app-8a4ef.firebasestorage.app",
  messagingSenderId: "639293026614",
  appId: "1:639293026614:web:b63de40397853550e88397",
  measurementId: "G-P60PPSDQ3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
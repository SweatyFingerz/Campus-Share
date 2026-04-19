import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAERp6NlhCdfdXBTC6J5VivA729Xzc1qFM",
  authDomain: "campus-b5f9a.firebaseapp.com",
  projectId: "campus-b5f9a",
  storageBucket: "campus-b5f9a.firebasestorage.app",
  messagingSenderId: "668802859262",
  appId: "1:668802859262:web:86b2893c91a3ee7bc065af",
  measurementId: "G-W8HWGFQ78J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

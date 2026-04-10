import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase Project Configuration
// You will get this from the Firebase Console -> Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDvhwEjR7Uk9_ER1l2XfJ5f60Q8T_8XwQk",
  authDomain: "craftnest-2bf0c.firebaseapp.com",
  projectId: "craftnest-2bf0c"
  // storageBucket, messagingSenderId, and appId can be added later if you need Storage or Analytics
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

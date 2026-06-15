import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your exact Firebase configuration from the screenshot
const firebaseConfig = {
  apiKey: "AIzaSyB87B0pZVYDm2p1kuRwRijWGg4hRKx16uU",
  authDomain: "recyglo-website.firebaseapp.com",
  projectId: "recyglo-website",
  storageBucket: "recyglo-website.firebasestorage.app",
  messagingSenderId: "216170276797",
  appId: "1:216170276797:web:6ef0201ea4dce585cd54d4",
  measurementId: "G-PH2VKY3FTK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools so the rest of your app can use them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
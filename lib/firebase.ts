import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCR7XW20yKrP-B9OvcGnQZ7oGJ7QfWv8XE",
    authDomain: "lairsbugblog.firebaseapp.com",
    databaseURL: "https://lairsbugblog-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lairsbugblog",
    storageBucket: "lairsbugblog.firebasestorage.app",
    messagingSenderId: "652256154706",
    appId: "1:652256154706:web:8610d3bc9f588c1ac3fb8b",
    measurementId: "G-28DJFQ5FST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Sign in anonymously immediately (needed for your DB security rules)
signInAnonymously(auth).catch((err) => console.error("Auth failed:", err));

// This matches your original structure
export const APP_ID = 'default-app-id';
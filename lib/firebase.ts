// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {  getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAA1TVHSfTzrK8f2WjFzNff2ipa3NgKRok",
  authDomain: "dineease-5d29a.firebaseapp.com",
  projectId: "dineease-5d29a",
  storageBucket: "dineease-5d29a.firebasestorage.app",
  messagingSenderId: "301500898334",
  appId: "1:301500898334:web:a85f896484899bd7d1620f",
  measurementId: "G-NQR3NKDH1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


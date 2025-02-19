// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };
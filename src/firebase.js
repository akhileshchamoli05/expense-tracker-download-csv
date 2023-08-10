import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDusP_fSL7dq7IKYdhye-NZCdWlhB_5Tn8",
    authDomain: "expense-tracker-8f63f.firebaseapp.com",
    projectId: "expense-tracker-8f63f",
    storageBucket: "expense-tracker-8f63f.appspot.com",
    messagingSenderId: "225275151593",
    appId: "1:225275151593:web:536c6c588d1b2ac699dc78"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();


const firestore = getFirestore(); // Initialize Firestore

export { app, auth, firestore }; // Export the firestore object
// for .env variables
// require('dotenv').config()

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "travel-together-ef83a.firebaseapp.com",
  projectId: "travel-together-ef83a",
  storageBucket: "travel-together-ef83a.appspot.com",
  messagingSenderId: "945583978666",
  appId: "1:945583978666:web:49be706a6b7e49b2c4f8d3",
  measurementId: "G-KZY9K5VXL2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
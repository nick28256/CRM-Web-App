// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABVZJ5-WuQ83RU7uxX9fJee_jBV72WsmA",
  authDomain: "crm-web-app-1a6d1.firebaseapp.com",
  projectId: "crm-web-app-1a6d1",
  storageBucket: "crm-web-app-1a6d1.firebasestorage.app",
  messagingSenderId: "110332790647",
  appId: "1:110332790647:web:5bcd2c977adea5d9e30372",
  measurementId: "G-H77M453W17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
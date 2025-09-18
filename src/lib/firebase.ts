
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMFrTBO57N2aj0onkfxz-ypCg0kM0WxIM",
  authDomain: "banglapremiums.firebaseapp.com",
  projectId: "banglapremiums",
  storageBucket: "banglapremiums.appspot.com",
  messagingSenderId: "561441591243",
  appId: "1:561441591243:web:34f62ad33464a825dcb04e",
  measurementId: "G-QXWS4VDGLJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);

export { app, firestore };

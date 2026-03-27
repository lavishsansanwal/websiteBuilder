// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: "genwebai-8beec.firebaseapp.com",
  projectId: "genwebai-8beec",
  storageBucket: "genwebai-8beec.firebasestorage.app",
  messagingSenderId: "179572705053",
  appId: "1:179572705053:web:7abcb92f92fd9ee39e03f4"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}

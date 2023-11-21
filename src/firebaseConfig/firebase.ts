// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiZ4NTG4mlzJ7Ck-awLH3RE9sADjk-9A0",
  authDomain: "streamy-d6143.firebaseapp.com",
  projectId: "streamy-d6143",
  storageBucket: "streamy-d6143.appspot.com",
  messagingSenderId: "73915318225",
  appId: "1:73915318225:web:503378805966ee55ad6af0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreClient = getFirestore();
export const authClient = getAuth();
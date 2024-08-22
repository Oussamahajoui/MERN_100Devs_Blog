// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "devs-blog-75ab2.firebaseapp.com",
    projectId: "devs-blog-75ab2",
    storageBucket: "devs-blog-75ab2.appspot.com",
    messagingSenderId: "248207185984",
    appId: "1:248207185984:web:9f54f6cc7b5358af96a7a5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
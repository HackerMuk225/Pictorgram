// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWX4AxKBPYhXzOxN68nFkqKVMq2x-MAGk",
  authDomain: "pictorgram-eb06a.firebaseapp.com",
  projectId: "pictorgram-eb06a",
  storageBucket: "pictorgram-eb06a.firebasestorage.app",
  messagingSenderId: "232194306824",
  appId: "1:232194306824:web:1d91b3e06a3b96ffc032bd",
  measurementId: "G-4XZNM7V0PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Configure Firestore to cache data for offline access
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
        } else if (err.code === 'unimplemented') {
            console.log('The current browser does not support all of the features required to enable persistence');
        }
    });

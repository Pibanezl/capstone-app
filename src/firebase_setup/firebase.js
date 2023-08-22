// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCCK0yk7jORZfp23kzn-v8YAsVaa7llSQ",
  authDomain: "portafolio-grupo6.firebaseapp.com",
  projectId: "portafolio-grupo6",
  storageBucket: "portafolio-grupo6.appspot.com",
  messagingSenderId: "74074331231",
  appId: "1:74074331231:web:551777354ca0ab53e163ea",
  measurementId: "G-PJ5GWFV3NV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const firestore = getFirestore(app)
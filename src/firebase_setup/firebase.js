// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

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

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore() 
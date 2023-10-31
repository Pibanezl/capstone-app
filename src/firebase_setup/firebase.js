// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { getStorage } from 'firebase/storage';
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

const firebaseApp = firebase.initializeApp(firebaseConfig);
// Configura Firebase para usar los emuladores en entorno de pruebas
/*if (process.env.NODE_ENV === 'test') {
  // Reemplaza con los valores correctos para tus emuladores
  const authEmulatorUrl = 'http://localhost:9099';
  const firestoreEmulatorHost = 'localhost';
  const firestoreEmulatorPort = 8080;

  // Activa los emuladores
  firebaseApp.auth().useEmulator(authEmulatorUrl);
  firebaseApp.firestore().settings({
    host: `${firestoreEmulatorHost}:${firestoreEmulatorPort}`,
    ssl: false, // Opcional, dependiendo de tu configuración de emuladores
  });
}*/

export { firebaseApp, getStorage };
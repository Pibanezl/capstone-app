import React, { useEffect, useState } from "react";
import {  collection, addDoc } from "firebase/firestore"; // Import Firestore functions from Firebase
import Chance from 'chance';
import colegios from "../Utils/colegios.json";
import { firebaseApp } from '../firebase_setup/firebase';
const chance = new Chance();

const StudentGenerator = ({ numStudents }) => {
  const db = firebaseApp.firestore();// Remove firebaseApp as it's already initialized globally
  console.log("Firestore instance:", db);
  const [students, setStudents] = useState([]);
  const cursos = [
    '1° Básico',
    '2° Básico',
    '3° Básico',
    '4° Básico',
    '5° Básico',
    '6° Básico',
    '7° Básico',
    '8° Básico',
    '1° Medio',
    '2° Medio',
    '3° Medio',
    '4° Medio'
  ];

  const nombresColegios = colegios.map(colegio => colegio["NOMBRE ESTABLECIMIENTO"]);
console.log("DATA ESTUDIANTES",students)
  const generateRandomStudent = () => {
    const indiceAleatorio = Math.floor(Math.random() * cursos.length);
    const cursoAleatorio = cursos[indiceAleatorio];

    const colegioAleatorio = nombresColegios[chance.integer({ min: 0, max: nombresColegios.length - 1 })];

    const student = {
      apellido: chance.last(),
      nombre: chance.first(),
      colegio: colegioAleatorio,
      curso: cursoAleatorio,
      mail: chance.email(),
    };
    return student;
  };

  const addStudentToFirestore = async () => {
    for (let i = 0; i < numStudents; i++) {
      const studentData = generateRandomStudent();
      try {
        const docRef = await addDoc(collection(db, "estudiantes"), studentData);
        console.log("Estudiante agregado con ID: ", docRef.id);
      } catch (error) {
        console.error("Error al agregar el estudiante: ", error);
      }
    }
  };

  useEffect(() => {
    // No need to create another db instance; you can directly use db from the outer scope
    db.collection("estudiantes")
      .get()
      .then((querySnapshot) => {
        const studentData = [];
        querySnapshot.forEach((doc) => {
          const studentWithId = {
            id: doc.id,
            ...doc.data(),
          };
          studentData.push(studentWithId);
        });
        setStudents(studentData);
        console.log("Registros de estudiantes:", studentData);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de estudiantes:", error);
      });
  }, [db]); 

  return (
    <div>
      <button onClick={addStudentToFirestore}>Agregar Estudiantes a Firebase</button>
    </div>
  );
};

export default StudentGenerator;

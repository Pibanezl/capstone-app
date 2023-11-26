import React, { useEffect, useState } from "react";
import {  collection, addDoc } from "firebase/firestore"; // Import Firestore functions from Firebase
import { GeoPoint } from 'firebase/firestore';
import colegios from "../Utils/colegios.json";
import { firebaseApp } from '../firebase_setup/firebase';

const StudentGeneratorIncident = ({ numStudents, user }) => {
    const db = firebaseApp.firestore(); // Remove firebaseApp as it's already initialized globally
    console.log("Firestore instance:", db);
    const [students, setStudents] = useState([]);
    const objetosConCoherencia = [
        {
            asunto: "Acoso en el patio de recreo",
            descripcion: "Hoy fui víctima de acoso en el patio de recreo. Un grupo de estudiantes mayores me intimidó y me hizo sentir inseguro.",
        },
        {
            asunto: "Cyberbullying en las redes sociales",
            descripcion: "Estoy siendo acosado en las redes sociales. Alguien está publicando mensajes ofensivos sobre mí y me hace sentir mal.",
        },
        {
            asunto: "Problemas con un compañero de clase",
            descripcion: "Tengo problemas con un compañero de clase. Siempre me molesta y me hace sentir incómodo en la escuela.",
        },
        {
            asunto: "Bullyng en el autobús escolar",
            descripcion: "Sufro de bullyng en el autobús escolar. Los estudiantes mayores me molestan y no sé cómo lidiar con la situación.",
        },
        {
            asunto: "Conflictos en el equipo deportivo",
            descripcion: "En el equipo deportivo, tengo conflictos con uno de mis compañeros. No puedo concentrarme en el juego debido a esta situación.",
        },
        {
            asunto: "Discriminación en la escuela",
            descripcion: "He experimentado discriminación en la escuela debido a mi apariencia. Esto me hace sentir excluido y herido.",
        },
        {
            asunto: "Comentarios ofensivos en clase",
            descripcion: "Algunos estudiantes hacen comentarios ofensivos en clase. Esto dificulta mi concentración y me siento herido por sus palabras.",
        },
        {
            asunto: "Problemas familiares",
            descripcion: "Estoy pasando por problemas familiares difíciles. Esto afecta mi rendimiento escolar y me preocupa constantemente.",
        },
        {
            asunto: "Presión de grupo",
            descripcion: "Siento presión por parte de mi grupo de amigos para hacer cosas con las que no me siento cómodo. No sé cómo manejarlo.",
        },
        {
            asunto: "Conflictos en el trabajo",
            descripcion: "Tengo conflictos en el trabajo con un compañero de equipo. Esto afecta nuestra productividad y el ambiente laboral.",
        },
        {
            asunto: "Dificultades académicas",
            descripcion: "Estoy teniendo dificultades académicas y me siento abrumado. Necesito ayuda para mejorar mis calificaciones.",
        },
        {
            asunto: "Bullyng en línea",
            descripcion: "He sido víctima de bullyng en línea. Los trolls y comentarios hirientes en internet me afectan emocionalmente.",
        },
        {
            asunto: "Problemas de comunicación",
            descripcion: "Tengo problemas de comunicación con mi familia. No nos entendemos y esto causa tensión en casa.",
        },
        {
            asunto: "Inseguridades personales",
            descripcion: "Lido con inseguridades personales que afectan mi autoestima. Quiero aprender a superar estos sentimientos.",
        },
        {
            asunto: "Conflictos con compañeros de cuarto",
            descripcion: "Tengo conflictos con mis compañeros de cuarto. No podemos ponerse de acuerdo en las normas de convivencia.",
        },
        {
            asunto: "Presión académica",
            descripcion: "Siento una gran presión académica para obtener buenas calificaciones. Esto me causa estrés y ansiedad.",
        },
        {
            asunto: "Dificultades financieras",
            descripcion: "Estoy pasando por dificultades financieras. No puedo permitirme ciertas necesidades básicas y esto me preocupa.",
        },
        {
            asunto: "Baja autoestima",
            descripcion: "Tengo una baja autoestima y luchando con la confianza en mí mismo. Quiero mejorar mi autoimagen.",
        },
        {
            asunto: "Problemas de salud mental",
            descripcion: "Estoy lidiando con problemas de salud mental, como la ansiedad y la depresión. Necesito apoyo para sobrellevarlo.",
        },
    ];
    function seleccionarElementoAlAzar(array) {
        const indiceAleatorio = Math.floor(Math.random() * array.length);
        return array[indiceAleatorio];
    }
    function seleccionarColegioAlAzar(listaDeColegios) {
        const indiceAleatorio = Math.floor(Math.random() * listaDeColegios.length);
        return listaDeColegios[indiceAleatorio];
    }
    
    const generateRandomStudentIncident = () => {
        const elementoAlAzar = seleccionarElementoAlAzar(objetosConCoherencia);
        const fecha = new Date();
        const estudianteAlAzar = seleccionarColegioAlAzar(students);
        console.log("estudiante al azar", estudianteAlAzar)

        const colegioEncontrado = colegios.find(colegio => colegio["NOMBRE ESTABLECIMIENTO"] === estudianteAlAzar.colegio);

        if (colegioEncontrado) {
            // El colegio con el nombre buscado fue encontrado
            console.log("Colegio encontrado:", colegioEncontrado);
        } else {
            // No se encontró ningún colegio con el nombre buscado
            console.log("Colegio no encontrado");
        }
        const latitud = parseFloat(colegioEncontrado.LATITUD.replace(',', '.'));
        const longitud = parseFloat(colegioEncontrado.LONGITUD.replace(',', '.'));

        if (isNaN(latitud) || isNaN(longitud) || latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
            console.error("Valores de latitud o longitud no válidos.");
            return null; // Si los valores son inválidos, retorna nulo
        }

        const ubicacion = new GeoPoint(latitud, longitud);

        const studentIncident = {
            titulo: elementoAlAzar.asunto,
            descripcion: elementoAlAzar.descripcion,
            fecha: fecha,
            idEstudiante: estudianteAlAzar.id,
            ubicacion: ubicacion,
            evidencia: "",
        };
        console.log("incidencia", studentIncident)
        return studentIncident;
    };

    const addStudentToFirestore = async () => {
        for (let i = 0; i < numStudents; i++) {
            const studentData = generateRandomStudentIncident();
            try {
                const docRef = await addDoc(collection(db, "incidenciaEstudiantil"), studentData);
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
            <button onClick={addStudentToFirestore}>Agregar Estudiantes a Firebase admin</button>
        </div>
    );
};

export default StudentGeneratorIncident;

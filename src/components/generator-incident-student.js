import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions from Firebase
import { GeoPoint } from 'firebase/firestore';
import colegios from "../Utils/colegios.json";
import { firebaseApp } from '../firebase_setup/firebase';

const StudentGeneratorIncident = ({ numStudents, user }) => {
    const db = firebaseApp.firestore(); // Remove firebaseApp as it's already initialized globally
    console.log("Firestore instance:", db);
    const [students, setStudents] = useState([]);
    const niveles2 = ['1° Básico',
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
    '4° Medio']
        console.log("USEEEEEEER",user)
        const incidenciasEnLaCalle = [
            {
                asunto: "Accidente de tráfico",
                descripcion: "Presencié un accidente de tráfico en la intersección. Necesita asistencia médica urgente.",
                categoria: "Accidente"
            },
            {
                asunto: "Robo en la calle",
                descripcion: "Vi a alguien robando en la calle. Necesitamos la intervención de la policía.",
                categoria: "Alerta"
            },
            {
                asunto: "Vandalismo en la comunidad",
                descripcion: "Alguien está vandalizando propiedades en la comunidad. Necesitamos medidas para detenerlo.",
                categoria: "Alerta"
            },
            {
                asunto: "Problemas de tráfico",
                descripcion: "Hay un gran atasco de tráfico en la avenida principal. Necesitamos control de tráfico.",
                categoria: "Alerta"
            },
            {
                asunto: "Incendio en una vivienda",
                descripcion: "Hay humo saliendo de una casa. Se requiere la intervención de los bomberos.",
                categoria: "Accidente"
            },
            {
                asunto: "Violencia callejera",
                descripcion: "Presencié una pelea en la calle entre dos grupos. Necesitamos la presencia policial.",
                categoria: "Alerta"
            },
            {
                asunto: "Intrusión en propiedad privada",
                descripcion: "Alguien está ingresando a una propiedad sin permiso. Necesitamos ayuda inmediata.",
                categoria: "Alerta"
            },
            {
                asunto: "Maltrato animal",
                descripcion: "Vi a alguien maltratando a un animal en la calle. Necesitamos la intervención de los servicios de animales.",
                categoria: "Alerta"
            },
            {
                asunto: "Caída en la acera",
                descripcion: "Presencié a alguien caerse en la acera. Puede necesitar atención médica.",
                categoria: "Accidente"
            },
            {
                asunto: "Ruido excesivo en la calle",
                descripcion: "Hay un nivel de ruido excesivo en la calle. Necesitamos que se investigue y controle.",
                categoria: "Alerta"
            },
            {
                asunto: "Problemas de iluminación en la calle",
                descripcion: "La iluminación en la calle es insuficiente. Necesitamos mejoras para aumentar la seguridad.",
                categoria: "Alerta"
            },
            {
                asunto: "Acoso en la vía pública",
                descripcion: "Fui acosado en la calle por un desconocido. Necesitamos medidas para prevenir esto.",
                categoria: "Acoso"
            },
            {
                asunto: "Basura acumulada en la calle",
                descripcion: "Hay una acumulación de basura en la calle. Necesitamos servicios de limpieza.",
                categoria: "Alerta"
            },
            {
                asunto: "Drogas en la vía pública",
                descripcion: "Presencié el consumo de drogas en la calle. Necesitamos intervención policial.",
                categoria: "Alerta"
            },
            {
                asunto: "Fuga de agua en la calle",
                descripcion: "Hay una fuga de agua en la calle. Necesitamos asistencia de servicios públicos.",
                categoria: "Accidente"
            },
            {
                asunto: "Manifestación en la comunidad",
                descripcion: "Hay una manifestación en la comunidad. Necesitamos supervisión para garantizar la seguridad.",
                categoria: "Alerta"
            },
            {
                asunto: "Problemas de saneamiento en la calle",
                descripcion: "Hay problemas de saneamiento en la calle. Necesitamos servicios municipales para abordarlo.",
                categoria: "Alerta"
            },
            {
                asunto: "Peatón atropellado",
                descripcion: "Presencié a un peatón siendo atropellado. Necesita asistencia médica urgente.",
                categoria: "Accidente"
            },
            {
                asunto: "Problemas de estacionamiento",
                descripcion: "Hay problemas de estacionamiento en la calle. Necesitamos regulaciones más estrictas.",
                categoria: "Alerta"
            },
            {
                asunto: "Emergencia médica en la calle",
                descripcion: "Alguien está experimentando una emergencia médica en la calle. Necesitamos ayuda médica urgente.",
                categoria: "Accidente"
            },
            {
                asunto: "Evento inusual en la calle",
                descripcion: "Presencié un evento inusual en la calle que no encaja en ninguna categoría específica. Necesitamos investigar.",
                categoria: "Otro"
            },
            {
                asunto: "Encuentro sospechoso en la comunidad",
                descripcion: "Noté un encuentro sospechoso entre dos personas en la comunidad. Necesitamos estar alerta.",
                categoria: "Alerta"
            },
            {
                asunto: "Evidencia de actividad ilegal",
                descripcion: "Encontré evidencia de actividad ilegal en la calle. Necesitamos la intervención de las autoridades.",
                categoria: "Evidencia"
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
    function seleccionarCursoAlAzar(niveles2) {
        const indiceAleatorio = Math.floor(Math.random() * niveles2.length);
        return niveles2[indiceAleatorio];
    }
    
    const generateRandomStudentIncident = () => {
        const elementoAlAzar = seleccionarElementoAlAzar(incidenciasEnLaCalle);
        const fecha = new Date();
        const estudianteAlAzar = seleccionarColegioAlAzar(students);
        console.log("usuarioss", students)
        console.log("estudiante al azar", estudianteAlAzar)
        const curso = seleccionarCursoAlAzar(niveles2)
        const colegioEncontrado = colegios.find(colegio => colegio["COMUNA"] === estudianteAlAzar.comuna.toUpperCase());

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
            categoriaIncidencia: elementoAlAzar.categoria,
            curso: "N/E",
            incidenceType: "Comunitaria",
            comuna: estudianteAlAzar.comuna.toLowerCase()
        };
        console.log("incidencia", studentIncident)
        return studentIncident;
    };

    const addStudentToFirestore = async () => {
        //generateRandomStudentIncident()
        for (let i = 0; i < numStudents; i++) {
            const studentData = generateRandomStudentIncident();
            try {
                const docRef = await addDoc(collection(db, "incidencias"), studentData);
                console.log("Estudiante agregado con ID: ", docRef.id);
            } catch (error) {
                console.error("Error al agregar el estudiante: ", error);
            }
        }
    };

    useEffect(() => {
        // No need to create another db instance; you can directly use db from the outer scope
        db.collection("usuarios")
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

import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { firebaseApp } from '../firebase_setup/firebase';
function Incidencia({ user }) {
    const [incidencia, setIncidencia] = useState(null);
    const { incidenciaId } = useParams();
    const [switchEvidencia, setSwitchEvidencia] = useState(false);
    useEffect(() => {
        console.log("INCIDENCIA ID", incidenciaId);

        const obtenerIncidencia = async () => {
            // Verifica si incidenciaId tiene un valor antes de intentar cargar la incidencia
            if (incidenciaId) {
                const db = firebaseApp.firestore();
                const docRef = db.collection('incidenciaEstudiantil').doc(incidenciaId);

                try {
                    const docSnapshot = await docRef.get();

                    if (docSnapshot.data() !== null && docSnapshot.data() !== undefined) {
                        // El documento existe, actualiza el estado con los datos de la incidencia
                        const data = docSnapshot.data();
                        setIncidencia(data);
                        console.log("Datos de la incidencia:", data);
                    } else {
                        console.log('No se encontró la incidencia con el ID proporcionado:', incidenciaId);
                    }
                } catch (error) {
                    console.error('Error al obtener la incidencia:', error);
                }
            } else {
                console.log('El ID de la incidencia es nulo o indefinido.');
            }
        };

        obtenerIncidencia();
    }, [incidenciaId]);

    if (!incidencia) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="Container-incidencia">
            <h1 className="titulo-incidencia">{incidencia.titulo}</h1>
            <p className="descripcion-incidencia">{incidencia.descripcion}</p>
            {incidencia.evidencia ? (<div className="Container-evidencia">
                {switchEvidencia === false ? (
                    <button className="btn-evidencia" onClick={() => setSwitchEvidencia(true)}>
                        ver evidencia
                    </button>
                ) : null}
                {switchEvidencia === true ? (
                    <button className="btn-evidencia" onClick={() => setSwitchEvidencia(false)}>
                        ocultar evidencia
                    </button>
                ) : null}
                {switchEvidencia ? (
                    <img src={incidencia.evidencia} alt="incidencia" className="img-evidencia"></img>) :
                    (
                        null
                    )}
            </div>) : null}

        </div>
    );
}

export default Incidencia;

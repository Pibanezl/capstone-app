import React, { useEffect, useState } from "react";
import { firebaseApp } from '../firebase_setup/firebase';
import '../styles/sass/dashboard.scss';
import { MapContainer, Popup, TileLayer, Marker } from 'react-leaflet';
import { Icon } from "leaflet";
import GraficoDeBarras from "../components/grafic-bar";
const Dashboard = ({ user }) => {
    const db = firebaseApp.firestore();
    const [incidencias, setIncidencias] = useState([]);
    const [activeIncidencia, setActiveIncidencia] = React.useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -33.449273, lng: -70.669315 });
    const [incidenciasNiveles, setIncidenciasNiveles] = useState([]);
    const icon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149983.png",
        iconSize: [25, 25]
    });

    const consultarDocumentoPorID = async (coleccion, documentoId) => {
        const db = firebaseApp.firestore(); // Reemplaza 'firebaseApp' con tu instancia de Firebase

        try {
            const documento = await db.collection(coleccion).doc(documentoId).get();
            return documento.exists ? documento.data() : null;
        } catch (error) {
            console.error('Error al consultar el documento:', error);
            return null;
        }
    };

    // Función para obtener los datos de incidencias agrupados por nivel
    const obtenerIncidenciasAgrupadasPorNivel = async (incidencias) => {
        console.log("ENTRO NIVELES")
        const niveles = {
            '1° Básico': 0,
            '2° Básico': 0,
            '3° Básico': 0,
            '4° Básico': 0,
            '5° Básico': 0,
            '6° Básico': 0,
            '7° Básico': 0,
            '8° Básico': 0,
            '1° Medio': 0,
            '2° Medio': 0,
            '3° Medio': 0,
            '4° Medio': 0
        };

        for (const incidencia of incidencias) {
            try {
                const estudiante = await consultarDocumentoPorID('estudiantes', incidencia.idEstudiante);
                console.log("ESTUDIANTE ID", estudiante)
                if (estudiante && niveles[estudiante.curso] !== undefined) {
                    niveles[estudiante.curso]++;
                }
            } catch (error) {
                console.error('Error al procesar una incidencia:', error);
            }
        }

        return niveles;
    };

    useEffect(() => {
        const fetchData = async () => {
            // Obtén los datos de incidencias
            const incidenciasData = await db.collection("incidencia-estudiantil").get()
                .then((querySnapshot) => {
                    const studentData = [];
                    querySnapshot.forEach((doc) => {
                        const studentWithId = {
                            id: doc.id,
                            ...doc.data(),
                        };
                        studentData.push(studentWithId);
                    });
                    setIncidencias(studentData);
                    console.log("Registros de incidencias estudiantiles:", studentData);
                    return studentData;
                })
                .catch((error) => {
                    console.error("Error al obtener los datos de incidencias estudiantiles:", error);
                });
    
            // Calcula las incidencias agrupadas por nivel
            const niveles = await obtenerIncidenciasAgrupadasPorNivel(incidenciasData);
            console.log('Incidencias agrupadas por nivel:', niveles);
            setIncidenciasNiveles(niveles);
        };
    
        fetchData();
    }, []);

    const handleStateChange = (incidencia) => {
        setActiveIncidencia(incidencia)
    };

    const handleIncidenceChange = (incidencia) => {
        setMapCenter({ lat: incidencia.ubicacion._lat, lng: incidencia.ubicacion._long });
        //obtenerDatosGeograficos(mapCenter.lat, mapCenter.lng);
    };

    /*function obtenerDatosGeograficos(latitud, longitud) {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}&zoom=18&addressdetails=1`;
    
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            // Accede a la información geográfica desde la respuesta JSON
            const address = data.display_name;
            const ciudad = data.address.city;
            const estado = data.address.state;
            const pais = data.address.country;
    
            console.log("Dirección completa:", address);
            console.log("Ciudad:", ciudad);
            console.log("Estado:", estado);
            console.log("País:", pais);
            console.log("data",data)
          } else {
            console.log("No se encontraron datos para las coordenadas proporcionadas.");
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos geográficos:", error);
        });
    }*/
    // Función para consultar un registro por su ID de documento



    return (
        <div className="Container-dashboard">
            <h1 className="Title-dashboard">INCIDENCIAS ESTUDIANTILES</h1>
            <div className="Container-incidencias-map">
                <div className="Container-incidencias">
                    {incidencias.map((incidencia, index) => (
                        <li className="Container-incidencias-li" key={index}>
                            <h2 className="titulo-incidencia">Asunto: {incidencia.titulo}</h2>
                            <p className="descripcion-incidencia">Descripción: {incidencia.descripcion}</p>
                            <div className="Container-buttons-incidencia">
                                <a className="Container-img-incidencia" href={incidencia.evidencia}>
                                    <img className="img-incidencia" src="https://cdn-icons-png.flaticon.com/512/4303/4303969.png" alt="incidencia"></img>
                                </a>
                                <button className="btn-ver-incidencia" onClick={() => handleIncidenceChange(incidencia)}>Ver mapa</button>
                            </div>
                        </li>
                    ))}
                </div>
                <div className="Container-map">
                    <MapContainer key={mapCenter.lat + mapCenter.lng} center={mapCenter} zoom={13}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {incidencias.map(incidencia => (
                            <Marker
                                key={incidencia.id}
                                position={[incidencia.ubicacion._lat, incidencia.ubicacion._long]}
                                icon={icon}
                                onClick={handleStateChange}
                            />
                        ))}

                        {activeIncidencia && (
                            <Popup
                                position={[
                                    activeIncidencia.ubicacion._lat,
                                    activeIncidencia.ubicacion._long
                                ]}
                                onClose={() => {
                                    setActiveIncidencia(null);
                                }}
                            >
                                <div>
                                    <h2>{activeIncidencia.titulo}</h2>
                                </div>
                            </Popup>
                        )}
                    </MapContainer>
                </div>
            </div>
            <div className="Container-incidencias-niveles">
                {Object.values(incidenciasNiveles).some((count) => count !== 0) && (
                    <GraficoDeBarras datosPorNivel={incidenciasNiveles} />
                )}
            </div>
        </div>);
}

export default Dashboard;
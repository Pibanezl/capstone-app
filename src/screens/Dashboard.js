import React, { useEffect, useState } from "react";
import { firebaseApp } from '../firebase_setup/firebase';
import '../styles/sass/dashboard.scss';
import { MapContainer, Popup, TileLayer, Marker } from 'react-leaflet';
import { Icon } from "leaflet";
import GraficoDeBarras from "../components/grafic-bar";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, onSnapshot, orderBy, query, where } from "@firebase/firestore";
const Dashboard = ({ user }) => {
    const db = firebaseApp.firestore();
    const [incidencias, setIncidencias] = useState([]);
    const [activeIncidencia, setActiveIncidencia] = React.useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -33.449273, lng: -70.669315 });
    const icon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149983.png",
        iconSize: [25, 25]
    });
    const [niveles2] = useState({
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
    });
    const [countByComuna, setCountByComuna] = useState([]);
    const [countByMonth, setCountByMonth] = useState([]);
    const [chartDataPie, setChartDataPie] = useState([]);
    const navigate = useNavigate();
    const [titleFilter, setTitleFilter] = useState('');
    const [count, setCount] = useState(0);
    console.log(count)
    const [descriptionFilter, setDescriptionFilter] = useState('');
    console.log("USERR DASHBOARD", user)
    const filteredIncidents = incidencias.filter((incidencia) => {
        //console.log("Incidencia",incidencia)
        let titleMatch
        let descriptionMatch
        if (incidencia.titulo !== undefined && incidencia.descripcion !== undefined) {
            titleMatch = incidencia.titulo.toLowerCase().includes(titleFilter.toLowerCase());
            descriptionMatch = incidencia.descripcion.toLowerCase().includes(descriptionFilter.toLowerCase());
        } else {
            console.log("ERROR UNDEFINED")
        }
        return titleMatch && descriptionMatch;
    });

    // Función para obtener los datos de incidencias agrupados por nivel
    const getDocumentCountByComuna = async (q) => {
        try {
            const querySnapshot = await getDocs(q);
            const countByComuna = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                const comuna = data.comuna; // Assuming "comuna" is the field in your data

                // Check if the comuna already exists in countByComuna
                if (countByComuna.hasOwnProperty(comuna)) {
                    // Increment the counter for the existing comuna
                    countByComuna[comuna]++;
                } else {
                    // Create a new entry for the comuna with a count of 1
                    countByComuna[comuna] = 1;
                }
            });

            // Convert countByComuna to an array of objects
            const comunaArray = Object.entries(countByComuna).map(([name, count]) => ({ name, count }));

            // Do something with comunaArray, e.g., log it
            console.log('Count by Comuna (Array):', comunaArray);
            setCountByComuna(comunaArray)
            // You can return comunaArray if needed for further processing
            return comunaArray;
        } catch (error) {
            console.error('Error getting data:', error);
            throw error;
        }
    };
    const getDocumentCountByMonth = async (q) => {
        try {
            const querySnapshot = await getDocs(q);
            const countByMonth = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                const incidenceDate = data.fecha.toDate(); // Assuming incidenceDate is a Date object

                // Get month information
                const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(incidenceDate);

                // Increment the counter for the corresponding month
                countByMonth[monthName] = (countByMonth[monthName] || 0) + 1;
            });

            // Update the state with the count by month
            setCountByMonth(countByMonth);

            // Do something with countByMonth, e.g., log it
            console.log('Count by Month:', countByMonth);

            // You can return countByMonth if needed for further processing
            return countByMonth;
        } catch (error) {
            console.error('Error getting data:', error);
            throw error;
        }
    };
    const getDocumetnsByCategory = async (q) => {
        onSnapshot(
            q,
            (querySnapshot) => {
                const countByCategory = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const categoriaIncidencia = data.categoriaIncidencia;

                    // Incrementar el contador para la categoría correspondiente
                    countByCategory[categoriaIncidencia] = (countByCategory[categoriaIncidencia] || 0) + 1;
                });

                const predefinedColors = ["#264653", "#2a9d8f", "#f4a261", "#ff3366", "#e9c46a"];

                // Convertir el objeto countByCategory a un array con el formato requerido
                const countArray = Object.entries(countByCategory).map((labels, index) => {
                    const color = predefinedColors[index % predefinedColors.length];
                    return {
                        name: labels[0],
                        population: labels[1],
                        color: color,
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15
                    };
                });

                setChartDataPie(countArray);
                console.log("CATEGORIAS", countArray)

                // Si necesitas devolver el array countArray, puedes hacerlo
                return countArray;
            }
        );
    }
    useEffect(() => {
        const fechaFormateada = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
         let q = ""
         if(user?.infoUsuario?.rol === "estudiante" || user?.infoUsuario?.rol ==="usuario"){
            q = query(
                collection(db, 'incidencias'),
                where('idEstudiante', '==', user?.uid),
                orderBy('fecha', 'desc')
            );
         } else{
            q = user?.infoUsuario?.rol === 'directorescuela' ? query(collection(db, 'incidencias'),
            where('ubicacion', '==', user?.infoUsuario?.ubicacion), orderBy('fecha', 'desc')
        ) : user?.infoUsuario?.rol === 'directorcomunidad' ? query(collection(db, 'incidencias'), where('incidenceType', '==', 'Comunitaria'), orderBy('fecha', 'desc')) :
            query(collection(db, 'incidencias'), where('incidenceType', '==', 'Academica'), orderBy('fecha', 'desc'))
         }
      
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const documents = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                let newCount = 0;
                documents.forEach((item) => {
                    const fechItemFormat = `${item.fecha.toDate().getDate().toString().padStart(2, '0')}/${(item.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}`;
                    if (fechaFormateada === fechItemFormat) {
                        newCount += 1;
                    }
                });

                setCount(newCount);
                console.log("INCIDENCIAS QUERY", documents)
                const filteredDocuments = documents.filter(item => item.idEstudiante === user?.uid);
                // Supongamos que documents es tu array de objetos
                console.log("USER FILTROOSSSSS",user)
                if(user?.infoUsuario?.rol === "usuario" || user?.infoUsuario?.rol === "estudiante"){
                    console.log("ROL USUARIO O ESTUDIANTE",filteredDocuments)
                    setIncidencias(filteredDocuments)
                }else{
                    console.log("ROL NO USUARIO O ESTUDIANTE")
                    setIncidencias(documents)
                }
               
                getDocumentCountByComuna(q)
                getDocumentCountByMonth(q)
                getDocumetnsByCategory(q)
                // Recorremos el array de objetos y sumamos la cantidad al curso correspondiente
                documents.forEach(objeto => {
                    const curso = objeto.curso;
                    if (curso in niveles2) {
                        niveles2[curso]++;
                    }
                });
            }
        );

        // Devolver la función de limpieza para desregistrar el observador cuando el componente se desmonta
        return () => unsubscribe();
    }, [db, user,niveles2]);

    const handleStateChange = (incidencia) => {
        console.log("ENTRO MARCADOR", incidencia)
        setActiveIncidencia(incidencia)

    };
    const handleActiveIncidenciaChange = () => {
        // ... código anterior ...
        console.log("ACTIVE INCIDENCIA", activeIncidencia)
        // Navega a la página de detalles de la incidencia
        navigate(`/incidencia/${activeIncidencia.id}`);
    };

    const handleIncidenceChange = (incidencia) => {
        setMapCenter({ lat: incidencia.ubicacion._lat, lng: incidencia.ubicacion._long });
        setActiveIncidencia(incidencia); // Actualiza la incidencia activa y la posición del mapa
        //obtenerDatosGeograficos(mapCenter.lat, mapCenter.lng);
    };


    if (user === null || user === undefined) {
        return (
            <div>NO HA INICIADO SESION</div>
        );
    } else if (user?.infoUsuario?.rol === "directorescuela") {
        return (
            <div className="Container-dashboard">
                <h1 className="Title-dashboard">INCIDENCIAS ESTUDIANTILES {user.infoUsuario.colegio}</h1>
                <div className="Container-incidencias-map">
                    <div className="Container-incidencias" style={{ width: 100 + "%" }}>
                        <div className="Container-incidencias-filtro">
                            <div className="title-incidencias-filtro">
                                <h2 className="title-incidencias-filtro">Filtros incidencias</h2>
                            </div>
                            <div className="body-incidencias-filtro">
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por asunto"
                                    value={titleFilter}
                                    onChange={(e) => setTitleFilter(e.target.value)}
                                />
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por descripción"
                                    value={descriptionFilter}
                                    onChange={(e) => setDescriptionFilter(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="Container-incidencias-lista">
                            {filteredIncidents.map((incidencia, index) => (
                                <li className="Container-incidencias-li" key={index}>
                                    <div className="Container-left">
                                        <h2 className="titulo-incidencia">Asunto: {incidencia.titulo}</h2>
                                        <p className="descripcion-incidencia">Descripción: {incidencia.descripcion}</p>
                                    </div>
                                    <div className="Container-right">
                                        <div className="Container-buttons-incidencia">
                                            <p className="fecha-incidencia"> {incidencia.fecha.toDate().getDate().toString().padStart(2, '0')}/{(incidencia.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="Container-incidencias-niveles">
                    {Object.values(niveles2).some((count) => count !== 0) && (
                        <GraficoDeBarras datosPorNivel={niveles2} datosComuna={countByComuna} datosMeses={countByMonth} datosCat={chartDataPie} rol={user.infoUsuario.rol} />
                    )}
                </div>
            </div>);
    } else if (user?.infoUsuario?.rol === "directorgeneral") {
        return (
            <div className="Container-dashboard">
                <h1 className="Title-dashboard">INCIDENCIAS ESTUDIANTILES REGIÓN METROPOLITANA</h1>
                <div className="Container-incidencias-map">
                    <div className="Container-incidencias">
                        <div className="Container-incidencias-filtro">
                            <div className="title-incidencias-filtro">
                                <h2 className="title-incidencias-filtro">Filtros incidencias</h2>
                            </div>
                            <div className="body-incidencias-filtro">
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por asunto"
                                    value={titleFilter}
                                    onChange={(e) => setTitleFilter(e.target.value)}
                                />
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por descripción"
                                    value={descriptionFilter}
                                    onChange={(e) => setDescriptionFilter(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="Container-incidencias-lista">
                            {filteredIncidents.map((incidencia, index) => (
                                <li className="Container-incidencias-li" key={index}>
                                    <div className="Container-left">
                                        <h2 className="titulo-incidencia">Asunto: {incidencia.titulo}</h2>
                                        <p className="descripcion-incidencia">Descripción: {incidencia.descripcion}</p>
                                    </div>
                                    <div className="Container-right">
                                        <div className="Container-buttons-incidencia">
                                            <p className="fecha-incidencia"> {incidencia.fecha.toDate().getDate().toString().padStart(2, '0')}/{(incidencia.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}</p>
                                            <button className="btn-ver-incidencia" onClick={() => handleIncidenceChange(incidencia)}>Ver mapa</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
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
                                    eventHandlers={{
                                        click: () => handleStateChange(incidencia),
                                    }}
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
                                        <button className="btn-ver-incidencia" onClick={handleActiveIncidenciaChange}>Ver detalles</button>
                                    </div>
                                </Popup>
                            )}
                        </MapContainer>
                    </div>
                </div>
                <div className="Container-incidencias-niveles">
                    {Object.values(niveles2).some((count) => count !== 0) && (
                        <GraficoDeBarras datosPorNivel={niveles2} datosComuna={countByComuna} datosMeses={countByMonth} datosCat={chartDataPie} rol={user.infoUsuario.rol} />
                    )}
                </div>
            </div>);
    } else if (user?.infoUsuario?.rol === "directorcomunidad") {
        return (
            <div className="Container-dashboard">
                <h1 className="Title-dashboard">INCIDENCIAS COMUNITARIAS REGIÓN METROPOLITANA</h1>
                <div className="Container-incidencias-map">
                    <div className="Container-incidencias" style={{ width: 40 + "%" }}>
                        <div className="Container-incidencias-filtro">
                            <div className="title-incidencias-filtro">
                                <h2 className="title-incidencias-filtro">Filtros incidencias</h2>
                            </div>
                            <div className="body-incidencias-filtro">
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por asunto"
                                    value={titleFilter}
                                    onChange={(e) => setTitleFilter(e.target.value)}
                                />
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por descripción"
                                    value={descriptionFilter}
                                    onChange={(e) => setDescriptionFilter(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="Container-incidencias-lista">
                            {filteredIncidents.map((incidencia, index) => (
                                <li className="Container-incidencias-li" key={index}>
                                    <div className="Container-left">
                                        <h2 className="titulo-incidencia">Asunto: {incidencia.titulo}</h2>
                                        <p className="descripcion-incidencia">Descripción: {incidencia.descripcion}</p>
                                    </div>
                                    <div className="Container-right">
                                        <div className="Container-buttons-incidencia">
                                            <p className="fecha-incidencia"> {incidencia.fecha.toDate().getDate().toString().padStart(2, '0')}/{(incidencia.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}</p>
                                            <button className="btn-ver-incidencia" onClick={() => handleIncidenceChange(incidencia)}>Ver mapa</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
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
                                    eventHandlers={{
                                        click: () => handleStateChange(incidencia),
                                    }}
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
                                        <button className="btn-ver-incidencia" onClick={handleActiveIncidenciaChange}>Ver detalles</button>
                                    </div>
                                </Popup>
                            )}
                        </MapContainer>
                    </div>
                </div>
                <div className="Container-incidencias-niveles">
                        <GraficoDeBarras datosComuna={countByComuna} datosMeses={countByMonth} datosCat={chartDataPie} rol={user.infoUsuario.rol} />
                </div>
            </div>);
    } else if (user?.infoUsuario?.rol === "usuario" || user?.infoUsuario?.rol === "estudiante") {
        return (
            <div className="Container-dashboard">
                <h1 className="Title-dashboard">INCIDENCIAS DE {user.infoUsuario.nombre.toUpperCase()} {user.infoUsuario.apellido.toUpperCase()}</h1>
                <div className="Container-incidencias-map">
                    {incidencias.length > 0 ? (<>
                        <div className="Container-incidencias" style={{ width: 40 + "%" }}>
                        <div className="Container-incidencias-filtro">
                            <div className="title-incidencias-filtro">
                                <h2 className="title-incidencias-filtro">Filtros incidencias</h2>
                            </div>
                            <div className="body-incidencias-filtro">
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por asunto"
                                    value={titleFilter}
                                    onChange={(e) => setTitleFilter(e.target.value)}
                                />
                                <input
                                    className="input-incidencias-filtro"
                                    type="text"
                                    placeholder="Filtrar por descripción"
                                    value={descriptionFilter}
                                    onChange={(e) => setDescriptionFilter(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="Container-incidencias-lista">
                            {filteredIncidents.map((incidencia, index) => (
                                <li className="Container-incidencias-li" key={index}>
                                    <div className="Container-left">
                                        <h2 className="titulo-incidencia">Asunto: {incidencia.titulo}</h2>
                                        <p className="descripcion-incidencia">Descripción: {incidencia.descripcion}</p>
                                    </div>
                                    <div className="Container-right">
                                        <div className="Container-buttons-incidencia">
                                            <p className="fecha-incidencia"> {incidencia.fecha.toDate().getDate().toString().padStart(2, '0')}/{(incidencia.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}</p>
                                            <button className="btn-ver-incidencia" onClick={() => handleIncidenceChange(incidencia)}>Ver mapa</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                    </div>
                    </>) : (<>
                        <div className="Container-incidencias" style={{ width: 40 + "%" }}>
                        <p className="mensaje-alerta-sin-incidencias">Para ver reflejadas sus incidencias en el mapa y ver el listado de incidencias debe tener al menos una incidencia creada.</p>
                        <a href="/form-incidencia" className="button-form-incidencia">
                                <span className="text-form-incidencia">Ir a formulario incidencia</span>
                            </a>
                    </div>
                    </>)}
                    
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
                                    eventHandlers={{
                                        click: () => handleStateChange(incidencia),
                                    }}
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
                                        <button className="btn-ver-incidencia" onClick={handleActiveIncidenciaChange}>Ver detalles</button>
                                    </div>
                                </Popup>
                            )}
                        </MapContainer>
                    </div>
                </div>
            </div>);
    }

}

export default Dashboard;
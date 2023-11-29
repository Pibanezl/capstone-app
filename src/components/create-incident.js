import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import 'firebase/firestore';
import 'firebase/storage';
import { GeoPoint, Timestamp } from 'firebase/firestore';
import { firebaseApp } from '../firebase_setup/firebase';
import colegios from "../Utils/colegios.json";
import Select from 'react-select';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const IncidenciaForm = ({ user }) => {
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();
  const storageRef = storage.ref();
  const [tipoIncidencia, setTipoIncidencia] = useState('Academica');
  const [asunto, setAsunto] = useState('');
  const [colegio, setColegio] = useState({
    value: "",
    latitud: "",
    longitud: "",
    label: "",
  });
  const [catIncidencia, setCatIncidencia] = useState('acoso');
  const [descripcion, setDescripcion] = useState('');
  const [evidenciaFile, setEvidenciaFile] = useState(null);
  const [evidenciaURL, setEvidenciaURL] = useState('');
  const [geolocalizacionActivada, setGeolocalizacionActivada] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [percent, setPercent] = useState(0);
  const options = colegios.map((colegio) => ({
    value: colegio["NOMBRE ESTABLECIMIENTO"],
    latitud: colegio["LATITUD"],
    longitud: colegio["LONGITUD"],
    label: colegio["NOMBRE ESTABLECIMIENTO"],
  }));

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `/files/${file.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            setPercent(percent);
        },
        (err) => console.log(err),
        () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url);
                setEvidenciaURL(url)
            });
        }
    );
};

  const handleEnviarClick = async () => {
    if (geolocalizacionActivada) {
      if (!user || !user.uid) {
        console.log("USER ERROR", user)
        toast.error('Usuario no autenticado');
        return;
      }
      if (latitude === undefined || longitude === undefined) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGeolocalizacionActivada(true);
            setShowPermissionModal(false);
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;
            setLatitude(latitud);
            setLongitude(longitud);
            console.log("CREAR GEO", latitud, longitud)
          },
          (error) => {
            toast.error('No se pudo acceder a la geolocalización. Asegúrate de que la geolocalización esté habilitada en tu navegador.');
            setShowPermissionModal(false);
          }
        );
        return;
      }


      const fechaTimestamp = Timestamp.fromDate(new Date());

      const colegioStudent = colegios.find(colegio => colegio['NOMBRE ESTABLECIMIENTO'] === user.infoUsuario.colegio)
      if(evidenciaFile){
        console.log("evidencia file",evidenciaURL)
        
      }
console.log("catIncidencia",catIncidencia)
      const incidenciaData = {
        titulo: asunto,
        descripcion: descripcion,
        fecha: fechaTimestamp,
        idEstudiante: user.uid,
        categoriaIncidencia: catIncidencia,
        curso: user.infoUsuario.rol === 'estudiante' ? user.infoUsuario.curso : 'N/E',
        ubicacion: user?.infoUsuario?.rol === 'usuario' && tipoIncidencia === 'Academica'
                ? new GeoPoint(parseFloat(colegio.latitud?.replace(',', '.')), parseFloat(colegio.longitud.replace(',', '.')))
                : user?.infoUsuario?.rol === 'usuario' && tipoIncidencia !== 'Academica'
                    ? new GeoPoint(latitude, longitude)
                    : user?.infoUsuario?.rol === 'estudiante' && tipoIncidencia === 'Academica'
                        ? new GeoPoint(parseFloat(colegioStudent.LATITUD?.replace(',', '.')), parseFloat(colegioStudent.LONGITUD.replace(',', '.')))
                        : new GeoPoint(latitude, latitude),
        evidencia: evidenciaURL,
        incidenceType: tipoIncidencia,
        comuna: user.infoUsuario.rol === 'usuario' ? user.infoUsuario.comuna : (colegioStudent["COMUNA"]).toLowerCase()
      };

      db.collection("incidencias")
        .add(incidenciaData)
        .then(() => {
          setAsunto('');
          setDescripcion('');
          setEvidenciaFile(null);
          setEvidenciaURL('');
          setCatIncidencia('')
          setTipoIncidencia('')
        })
        .catch((error) => {
          console.error('Error al agregar la incidencia:', error);
        });
    } else {
      setShowPermissionModal(true);
    }
  };



  const handleAceptarPermiso = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocalizacionActivada(true);
        setShowPermissionModal(false);
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;
        setLatitude(latitud);
        setLongitude(longitud);
        console.log("CREAR GEO", latitud, longitud)
      },
      (error) => {
        toast.error('No se pudo acceder a la geolocalización. Asegúrate de que la geolocalización esté habilitada en tu navegador.');
        setShowPermissionModal(false);
      }
    );
  };

  const handleCancelarPermiso = () => {
    setShowPermissionModal(false);
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocalizacionActivada(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            // La geolocalización se denegó, no hagas nada aquí
          } else {
            toast.error('No se pudo acceder a la geolocalización. Asegúrate de que la geolocalización esté habilitada en tu navegador.');
          }
        }
      );
    } else {
      toast.error('Tu navegador no admite geolocalización.');
    }
  }, []);

  useEffect(() => {/*
    if (evidenciaFile) {
      const evidenciaRef = storageRef.child(evidenciaFile.name);

      evidenciaRef.put(evidenciaFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          setEvidenciaURL(downloadURL);
        });
      });
    }*/
  }, [evidenciaFile, storageRef]);

  return (
    <div>
      <h2>Formulario de Incidencia</h2>
      <div>
        <label htmlFor="tipoIncidencia">Tipo de Incidencia:</label>
        <select
          id="tipoIncidencia"
          value={tipoIncidencia} 
          onChange={(e) => setTipoIncidencia(e.target.value)}
        >
          <option value="Academica">Académica</option>
          <option value="Comunitaria">Comunitaria</option>
        </select>
      </div>
      <div className="container-colegio">
        {user?.infoUsuario?.rol === 'usuario' && tipoIncidencia === "Academica" && (
          <>
          <label htmlFor="colegio">Colegio:</label>
              <Select
                className="Input-login-colegio"
                value={colegio.value}
                onChange={(e) => setColegio(e)}
                options={options}
                isSearchable={true}
                placeholder="Selecciona un colegio"
              />
          </>  
        )}
      </div>
      <div>
        <label htmlFor="asunto">Asunto:</label>
        <input
          type="text"
          id="asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="tipoIncidencia">Categoria de Incidencia:</label>
        <select
          id="categoriaIncidencias"
          value={catIncidencia} 
          onChange={(e) => setCatIncidencia(e.target.value)}
        >
          <option value="acoso">Acoso</option>
          <option value="accidente">Accidente</option>
          <option value="evidencia">Evidencia</option>
          <option value="alerta">Alerta</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="evidencia">Evidencia adjunta:</label>
        <input
          accept="/image/*"
          type="file"
          id="evidencia"
          onChange={handleUpload}
        />
        <p>{percent} "% done"</p>
      </div>
      <div>
        <button onClick={handleEnviarClick}>Enviar</button>
      </div>
      <Modal
        style={{
          content: {
            width: '80%',
            height: '80%',
          },
        }}
        isOpen={showPermissionModal}
        onRequestClose={handleCancelarPermiso}
        contentLabel="Permiso de Geolocalización"
        className="modal-geolocalizacion"
      >
        <h2 className="title-modal-geolocalizacion">¿Permitir el acceso a la geolocalización?</h2>
        <button className="button-modal-geolocalizacion" onClick={handleAceptarPermiso}>Sí</button>
        <button className="button-modal-geolocalizacion" onClick={handleCancelarPermiso}>No</button>
      </Modal>
    </div>
  );
};

export default IncidenciaForm;

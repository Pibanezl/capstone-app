import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import 'firebase/firestore';
import 'firebase/storage';
import { GeoPoint } from 'firebase/firestore';
import { firebaseApp } from '../firebase_setup/firebase';

const IncidenciaForm = ({ user }) => {
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();
  const storageRef = storage.ref();
  const [tipoIncidencia, setTipoIncidencia] = useState('academica');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [evidenciaFile, setEvidenciaFile] = useState(null);
  //const [evidenciaURL, setEvidenciaURL] = useState('');
  const [geolocalizacionActivada, setGeolocalizacionActivada] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const handleEnviarClick = () => {
    if (geolocalizacionActivada) {
      if (!user || !user.uid) {
        console.log("USER ERROR",user)
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
            console.log("CREAR GEO",latitud,longitud)
          },
          (error) => {
            toast.error('No se pudo acceder a la geolocalización. Asegúrate de que la geolocalización esté habilitada en tu navegador.');
            setShowPermissionModal(false);
          }
        );
        return;
      }
      const fecha = new Date();

      const ubicacion = new GeoPoint(latitude, longitude);

      const incidenciaData = {
        titulo: asunto,
        descripcion: descripcion,
        fecha: fecha,
        idEstudiante: user.uid,
        ubicacion: ubicacion,
        //evidencia: evidenciaURL,
        evidencia: "evidenciaURL",
      };

      const coleccionIncidencia =
        tipoIncidencia === 'academica' ? 'incidenciaEstudiantil' : 'incidencia-comunitaria';

      db.collection(coleccionIncidencia)
        .add(incidenciaData)
        .then(() => {
          setAsunto('');
          setDescripcion('');
          setEvidenciaFile(null);
          //setEvidenciaURL('');
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
        console.log("CREAR GEO",latitud,longitud)
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEvidenciaFile(file);
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
          <option value="academica">Académica</option>
          <option value="comunitaria">Comunitaria</option>
        </select>
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
        <label htmlFor="evidencia">Evidencia adjunta:</label>
        <input
          type="file"
          id="evidencia"
          onChange={handleFileChange}
        />
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

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import '../styles/sass/form-incident.scss';

const IncidenciaForm = () => {
  const [tipoIncidencia, setTipoIncidencia] = useState('academica');
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [evidencia, setEvidencia] = useState('');
  const [geolocalizacionActivada, setGeolocalizacionActivada] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleEnviarClick = () => {
    if (geolocalizacionActivada) {
      console.log('Enviando incidencia:', {
        tipoIncidencia,
        asunto,
        descripcion,
        evidencia,
      });
    } else {
      // No se puede enviar la incidencia si la geolocalización no está activada
      setShowPermissionModal(true);
    }
  };

  const handleAceptarPermiso = () => {
    // Cuando el usuario acepta el permiso en el modal
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocalizacionActivada(true);
        setShowPermissionModal(false); // Cerrar el modal después de aceptar
      },
      (error) => {
        // Manejar errores, si es necesario
        toast.error('No se pudo acceder a la geolocalización. Asegúrate de que la geolocalización esté habilitada en tu navegador.');
        setShowPermissionModal(false); // Cerrar el modal en caso de error
      }
    );
  };

  const handleCancelarPermiso = () => {
    // Cuando el usuario cancela el permiso en el modal
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
            // Otro error de geolocalización, si es necesario, maneja el error
            // toast.error('No se pudo acceder a la geolocalización. Asegúrate de que la geolocalización esté habilitada en tu navegador.');
          }
        }
      );
    } else {
      toast.error('Tu navegador no admite geolocalización.');
    }
  }, []);

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
          value={evidencia}
          onChange={(e) => setEvidencia(e.target.value)}
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

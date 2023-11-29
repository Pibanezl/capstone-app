import React, { useEffect} from 'react';
import '../styles/sass/DropdownMenu.scss';
import { firebaseApp} from '../firebase_setup/firebase';

const ClonarColeccion = () => {
    const db = firebaseApp.firestore();
  useEffect(() => {
    console.log("SE COPIARON LOS DATOS A LA NUEVA BASE DE DATOS")
   
db.collection('incidencia-estudiantil').get().then(snapshot => {
  snapshot.forEach(doc => {
    db.collection('incidenciaEstudiantil').doc(doc.id).set(doc.data());
  });
});

//ELIMINAR COLECCION CON GUION
/*db.collection('nombre-original').get().then(snapshot => {
  snapshot.forEach(doc => {
    doc.ref.delete();
  });
});*/
  }, [db]);
  return (
    <div className="dropdown-container">
    </div>
  );
};

export default ClonarColeccion;
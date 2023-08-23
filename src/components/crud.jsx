import React, { useState } from 'react';
import useCollectionData from '../firebase_setup/useCollectionData';
import { db } from '../firebase_setup/firebase'; // Asegúrate de que la ruta sea correcta

const CRUDComponent = ({ collectionName }) => {
    const data = useCollectionData(collectionName);
    const [editandoUsuario, setEditandoUsuario] = useState(null); // Estado para rastrear el usuario en edición
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoApellido, setNuevoApellido] = useState('');
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', apellido: '' });
    const editarUsuario = (usuarioId) => {
        // Iniciar la edición del usuario
        setEditandoUsuario(usuarioId);
        setNuevoNombre('');
        setNuevoApellido('');
    };

    const actualizarUsuario = async () => {
        try {
            await db.collection('usuarios').doc(editandoUsuario).update({
                nombre: nuevoNombre,
                apellido: nuevoApellido
            });
            setEditandoUsuario(null); // Finalizar la edición
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
        }
    };

    const borrarUsuario = async (userId) => {
        try {
          await db.collection('usuarios').doc(userId).delete();
        } catch (error) {
          console.error('Error al borrar usuario:', error);
        }
      };

      const agregarUsuario = async () => {
        try {
          await db.collection('usuarios').add(nuevoUsuario);
          setNuevoUsuario({ nombre: '', apellido: '' });
        } catch (error) {
          console.error('Error al agregar usuario:', error);
        }
      };

    return (
        <div>
            <h2>Administración de Usuarios</h2>
            <ul>
                {data.map((usuario) => (
                    <li key={usuario.id}>
                        {editandoUsuario === usuario.id ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={nuevoNombre}
                                    onChange={(e) => setNuevoNombre(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Apellido"
                                    value={nuevoApellido}
                                    onChange={(e) => setNuevoApellido(e.target.value)}
                                />
                                <button onClick={actualizarUsuario}>Guardar</button>
                            </div>
                        ) : (
                            <div>
                                {usuario.data.nombre} {usuario.data.apellido}
                                <button onClick={() => borrarUsuario(usuario.id)}>Borrar</button>
                                <button onClick={() => editarUsuario(usuario.id)}>Editar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevoUsuario.nombre}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    value={nuevoUsuario.apellido}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })}
                />
                <button onClick={agregarUsuario}>Agregar Usuario</button>
            </div>
        </div>
    );
};

export default CRUDComponent;

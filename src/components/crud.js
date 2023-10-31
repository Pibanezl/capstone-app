process.env.NODE_ENV = 'test';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase_setup/firebase';
import Loading from 'react-loading';
const UserCrud = () => {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', apellido: '' });
  const [editandoUsuario, setEditandoUsuario] = useState(null); // Estado para rastrear el usuario en edición
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoApellido, setNuevoApellido] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    //setLoading(true);
    const querySnapshot = await db.collection('usuarios').get();
    const auxUsuarios = [];
    querySnapshot.forEach(doc => {
      auxUsuarios.push({ id: doc.id, ...doc.data() });
    });
    setUsuarios(auxUsuarios);
    setLoading(false); // Detener la animación de carga cuando los datos se han cargado
  };

  const agregarUsuario = async () => {
    try {
      setLoading(true);
      await db.collection('usuarios').add(nuevoUsuario);
      setNuevoUsuario({ nombre: '', apellido: '' });
      fetchData();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
    setLoading(false);
  };

  const borrarUsuario = async (userId) => {
    try {
      await db.collection('usuarios').doc(userId).delete();
      fetchData();
    } catch (error) {
      console.error('Error al borrar usuario:', error);
    }
    setLoading(false); 
  };

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
      fetchData();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
    setLoading(false); 
  };

  return (
    <div>
      <h2>Administración de Usuarios</h2>
      {loading ? (
        <Loading className="loading" type="spin" color="#000000" height={50} width={50} /> // Animación de carga
      ) : (
        <ul>
          
        {usuarios.map((usuario) => (
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
                {usuario.nombre} {usuario.apellido}
                <button onClick={() => borrarUsuario(usuario.id)}>Borrar</button>
                <button onClick={() => editarUsuario(usuario.id)}>Editar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      )}
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

export default UserCrud;
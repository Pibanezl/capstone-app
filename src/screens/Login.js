import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { firebaseApp } from '../firebase_setup/firebase';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  // getFirestore,
  doc,
  collection,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import PasswordReset from '../components/ResetPass';
import colegios from "../Utils/colegios.json";
import Select from 'react-select';
function Login({ user }) {
  const auth = getAuth(firebaseApp);
  const firestore = firebaseApp.firestore();
  //const [isRegistrando, setIsRegistrando] = useState(false);
  const [switchPass, setSwitchPass] = useState(false);
  const [switchRegistrar, setSwitchRegistrar] = useState(false);
  const [switchIsStudent, setSwitchIsStudent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let rol = "admin"
  const [estudiante, setEstudiante] = useState({
    nombre: '',
    apellido: '',
    colegio: {},
    curso: '',
    email: '',
    password: '',
  });
  const [usuario, setUsuarios] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    comuna: '',
    calle: '',
    email: '',
    password: '',
  });
  const options = colegios.map((colegio) => ({
    value: colegio["NOMBRE ESTABLECIMIENTO"],
    label: colegio["NOMBRE ESTABLECIMIENTO"],
  }));
  const cursos = [
    '1° Básico',
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
    '4° Medio'
  ];

  async function registrarUsuario(email, password, rol) {
    let docuRef;
    try {
      const infoUsuario = await createUserWithEmailAndPassword(auth, email, password);
      if (switchIsStudent) {
        console.log("is estudent")
        docuRef = doc(firestore, `estudiantes/${infoUsuario.user.uid}`);
        await setDoc(docuRef, { nombre: estudiante.nombre, apellido: estudiante.apellido, colegio: estudiante.colegio, curso: estudiante.curso, email: estudiante.email, rol: "student" });
      } else {
        console.log("NO ")
        docuRef = doc(firestore, `usuarios/${infoUsuario.user.uid}`);
        await setDoc(docuRef, { nombre: usuario.nombre, apellido: usuario.apellido, rut: usuario.rut, comuna: usuario.comuna, calle: usuario.calle, email: usuario.email, rol: "user" });
      }

      // Registro exitoso, puedes realizar otras acciones aquí si es necesario.
      toast.success('Registro de usuario exitoso');
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Usuario ya registrado");
      } else if (error.code === "auth/weak-password" || error.code === "auth/missing-password") {
        toast.error("Ingrese una contraseña con minimo 6 caracteres");
      } else {
        toast.error("Error al registrar usuario");
      }
      console.log("ERROR CODE", error.code)
      console.log("ERROR MESSAGE", error.message)
    }
  }


  function submitHandler(e) {
    e.preventDefault();
    console.log("submit", email, password, rol);
    handleSignIn(email, password)
  }

  const handleSignIn = async (email, password) => {
    console.log("EMAIL", email, "PASSWORD", password)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Obtener una referencia a la colección de usuarios
      const usersCollection = collection(firestore, "usuarios");

      // Consulta para buscar un usuario por correo electrónico
      const userQuery = query(usersCollection, where("correo", "==", email));

      // Obtener los documentos que coinciden con la consulta
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // El usuario con este correo electrónico existe en la colección
        // Puedes obtener el rol desde el primer documento (debería haber solo uno)
        const userDoc = querySnapshot.docs[0];
        const userRole = userDoc.data().rol;

        if (userRole === "admin") {
          // Mostrar la función de administrador
          console.log("INICIO ADMIN");
          //return <AdminFunction />;
        } else if (userRole === "user") {
          // Mostrar la función de usuario regular
          console.log("INICIO USER");
          //return <UserFunction />;
        }
      }
      toast.success('Inicio de sesión exitoso');

    } catch (error) {
      // Error al iniciar sesión, muestra una notificación
      toast.error('Inicio de sesión fallido. Verifica tus credenciales.');
    }
  };

  function submitHandlerStudent(e) {
    e.preventDefault();
    console.log("submit", email, password, rol);
    registrarUsuario(estudiante.email, estudiante.password, "student");

  }

  function submitHandlerUser(e) {
    e.preventDefault();
    console.log("submit", email, password, rol);
    registrarUsuario(usuario.email, usuario.password, "user");
  }
  return (
    <div className="Container-login">
      {user != null ? (
        <div className="Container-login-active">
          <h1 className="Title-login">"sesion-iniciada"</h1>
        </div>
      ) : (
        <div className="Container-login-inactive">
          <h1 className="Title-login">Perfil</h1>
          <div className="Container-form-login-div">
            <form onSubmit={submitHandler} className="Container-form-login">
              <div className="Label-login">
                <p className="title-Input-login">Usuario:</p>
                <input className="Input-login-user" type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
              </div>
              <div className="Label-login">
                <p className="title-Input-login">Contraseña:</p>
                <input className="Input-login-password" type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} />
              </div>
              <input
                type="submit"
                className="btn-enviar-form-login"
                value={"Iniciar sesion"}
              />
            </form>
            <button onClick={() => setSwitchPass(!switchPass)} className="btn-restablecer-form-login">Restablecer contraseña</button>
            {switchPass ? <PasswordReset /> : null}
          </div>
        </div>
      )}

      {<button onClick={() => setSwitchRegistrar(!switchRegistrar)} className="btn-quiero-restablecer">
        {switchRegistrar ? "Ya tengo cuenta" : "Quiero registarme"}
      </button>}

      {switchRegistrar ? (
        <div className="Container-is-student">
          <p className="text-is-student">¿Es estudiante?</p>
          <input type="checkbox" id="esEstudiante" className="checkbox-is-student" onClick={() => setSwitchIsStudent(!switchIsStudent)} value={switchIsStudent} />
        </div>
      ) : null}

      {switchRegistrar ? (
        <div className="Container-login-inactive">
          {switchIsStudent ? (
            <div className="Container-login-inactive">
              <h1 className="Title-login">Registar estudiante</h1>
              <div className="Container-form-login-div">
                <form onSubmit={submitHandlerUser} className="Container-form-login">
                  <div className="Label-login">
                    <p className="title-Input-login">Nombre:</p>
                    <input className="Input-login-nombre" type="text" name="nombre" value={estudiante.nombre} onChange={(e) => setEstudiante({ ...estudiante, nombre: e.target.value })} placeholder="Nombre" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Apellido:</p>
                    <input className="Input-login-apellido" type="text" name="apellido" value={estudiante.apellido} onChange={(e) => setEstudiante({ ...estudiante, apellido: e.target.value })} placeholder="Apellido" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Colegio:</p>
                    <Select
                      className="Input-login-colegio"
                      value={estudiante.colegio}
                      onChange={(e) => setEstudiante({ ...estudiante, colegio: e.target.value })}
                      options={options}
                      isSearchable={true}
                      placeholder="Selecciona un colegio"
                    />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Curso:</p>
                    <select className="Input-login-curso" name="curso" value={estudiante.curso} onChange={(e) => setEstudiante({ ...estudiante, curso: e.target.value })}>
                      <option value="">Seleccionar Curso</option>
                      {cursos.map((curso) => (
                        <option key={curso} value={curso}>
                          {curso}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Email:</p>
                    <input className="Input-login-email" type="text" name="email" value={estudiante.email} onChange={(e) => setEstudiante({ ...estudiante, email: e.target.value })} placeholder="Email" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Contraseña:</p>
                    <input className="Input-login-password" type="password" id="password" name="password" value={estudiante.password} onChange={(e) => setEstudiante({ ...estudiante, password: e.target.value })} placeholder="Password" />
                  </div>
                  <input
                    type="submit"
                    className="btn-enviar-form-login"
                    value={"Registrar"}
                  />
                </form>
              </div>
            </div>
          ) : (
            <div className="Container-login-inactive">
              <h1 className="Title-login">Registar Usuario</h1>
              <div className="Container-form-login-div">
                <form onSubmit={submitHandlerStudent} className="Container-form-login">
                  <div className="Label-login">
                    <p className="title-Input-login">Nombre:</p>
                    <input className="Input-login-nombre" type="text" name="nombre" value={usuario.nombre} onChange={(e) => setUsuarios({ ...usuario, nombre: e.target.value })} placeholder="Nombre" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Apellido:</p>
                    <input className="Input-login-apellido" type="text" name="apellido" value={usuario.apellido} onChange={(e) => setUsuarios({ ...usuario, apellido: e.target.value })} placeholder="Apellido" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Rut:</p>
                    <input className="Input-login-apellido" type="text" name="rut" value={usuario.rut} onChange={(e) => setUsuarios({ ...usuario, rut: e.target.value })} placeholder="Apellido" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Comuna:</p>
                    <input className="Input-login-apellido" type="text" name="apellido" value={usuario.comuna} onChange={(e) => setUsuarios({ ...usuario, comuna: e.target.value })} placeholder="Apellido" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Calle:</p>
                    <input className="Input-login-apellido" type="text" name="apellido" value={usuario.calle} onChange={(e) => setUsuarios({ ...usuario, calle: e.target.value })} placeholder="Apellido" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Email:</p>
                    <input className="Input-login-email" type="text" name="email" value={usuario.email} onChange={(e) => setUsuarios({ ...usuario, email: e.target.value })} placeholder="Email" />
                  </div>
                  <div className="Label-login">
                    <p className="title-Input-login">Contraseña:</p>
                    <input className="Input-login-password" type="password" id="password" name="password" value={usuario.password} onChange={(e) => setUsuarios({ ...usuario, password: e.target.value })} placeholder="Password" />
                  </div>
                  <input
                    type="submit"
                    className="btn-enviar-form-login"
                    value={"Registrar"}
                  />
                </form>
              </div>
            </div>)}
        </div>
      ) : null}
    </div>
  );
}

export default Login;

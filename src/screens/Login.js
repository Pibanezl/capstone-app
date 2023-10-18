import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebaseApp from "../firebase_setup/firebase";
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
function Login() {
  const auth = getAuth(firebaseApp);
  const firestore = firebaseApp.firestore();
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [switchPass, setSwitchPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("admin");

  async function registrarUsuario(email, password, rol) {
    try {
      const infoUsuario = await createUserWithEmailAndPassword(auth, email, password);

      const docuRef = doc(firestore, `usuarios/${infoUsuario.user.uid}`);
      await setDoc(docuRef, { correo: email, rol: rol });
      // Registro exitoso, puedes realizar otras acciones aquí si es necesario.
      toast.success('Registro de usuario exitoso');
    } catch (error) {
      if(error.code === "auth/email-already-in-use"){
        toast.error("Usuario ya registrado");
      } else if(error.code === "auth/weak-password" || error.code === "auth/missing-password"){
        toast.error("Ingrese una contraseña con minimo 6 caracteres");
      }else{
        toast.error("Error al registrar usuario");
      }
      console.log("ERROR CODE", error.code)
      console.log("ERROR MESSAGE", error.message)
    }
  }


  function submitHandler(e) {
    e.preventDefault();
    console.log("submit", email, password, rol);
    //setEmail(e.target.elements.email.value)
    //setPassword(e.target.elements.password.value)


    if (isRegistrando) {
      console.log("REGISTRAR USUARIO")
      // registrar
      //setRol(e.target.elements.rol.value)
      registrarUsuario(email, password, rol);
    } else {
      console.log("INICIAR SESION")
      // login
      handleSignIn(email, password)
    }
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

  function actualizarRegistrando () {
    setIsRegistrando(!isRegistrando)
  }

  return (
    <div>
      <h1>{isRegistrando ? "Regístrate" : "Inicia sesión"}</h1>

      <form onSubmit={submitHandler}>
        <label>
          Correo electrónico:
          <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
        </label>

        <label>
          Contraseña:
          <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
        </label>

        {isRegistrando ? (
        <label>
          Rol:
          <select id="rol" onChange={(event) => setRol(event.target.value)} value={rol}>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </label>) : null}
        
        <input
          type="submit"
          value={isRegistrando ? "Registrar" : "Iniciar sesión"}
        />
      </form>

      {<button onClick={() => actualizarRegistrando()}>
        {isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"}
        </button>}
      <button onClick={() => setSwitchPass(!switchPass)}>Restablecer contraseña</button>
      {switchPass ? <PasswordReset /> : null}
    </div>
  );
}

export default Login;

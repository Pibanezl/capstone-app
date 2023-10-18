import React from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import firebaseApp from "../firebase_setup/firebase"
import { getAuth, signOut } from "firebase/auth";
//import { getFirestore } from 'firebase/firestore';
const auth = getAuth(firebaseApp);
function Home({ user }) {
  return (
    <div>
      Home
      <button onClick={() => signOut(auth)}> Cerrar sesión</button>
      {user.rol === "admin" ? <AdminView /> : <UserView />}
    </div>
  );
}

export default Home;

import React from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import firebaseApp from "../firebase_setup/firebase"
import { getAuth, signOut } from "firebase/auth";
//import { getFirestore } from 'firebase/firestore';
import BannerPrincipal from '../components/banner-principal';
const auth = getAuth(firebaseApp);
function Home({ user }) {

  return (
    <div>
      {user === null ? (
      <div>
        Home comun
        <BannerPrincipal/>
        </div>) :
        (<div>
          Home
          <BannerPrincipal/>
          {user.rol === "admin" ? <AdminView /> : <UserView />}
        </div>)}
    </div>
  );
}

export default Home;

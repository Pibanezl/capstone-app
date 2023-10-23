import React from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import BannerPrincipal from '../components/banner-principal';
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

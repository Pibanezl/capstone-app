import React from "react";
import BannerPrincipal from '../components/banner-principal';
//import StudentGenerator from "../components/generator-students"
//import StudentGeneratorIncident from "../components/generator-incident-student"
import "../styles/sass/general.scss"
function Home({ user }) {

  return (
    <div>
      {user === null ? (
      <div>
        <h2 style={{color: "white"}}>BIENVENIDO {user?.infoUsuario?.nombre.toUpperCase()} {user?.infoUsuari?.apellido.toUpperCase()}</h2>
        <BannerPrincipal/>
        </div>) :
        (<div>
          <h2 style={{color: "white"}}>BIENVENIDO {user?.infoUsuario?.nombre.toUpperCase()} {user?.infoUsuari?.apellido.toUpperCase()}</h2>
          {/*<StudentGeneratorIncident numStudents={50} user={user}/>
          <StudentGenerator user={user} numStudents={50}/>*/}
          <BannerPrincipal/>
        </div>)}
    </div>
  );
}

export default Home;

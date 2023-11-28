import React from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import BannerPrincipal from '../components/banner-principal';
import SobreNosotros from '../components/sobre-nosotros';
/*import StudentGenerator from "../components/generator-students"
import StudentGeneratorIncident from "../components/generator-incident-student"*/
import ClonarColeccion from "../components/cambiar-coleccion"
function Home({ user }) {

  return (
    <div className="home-body">
      {user === null ? (
      <div className="home-comun">
        <BannerPrincipal/>
        <SobreNosotros/>
        </div>) :
        (<div>
          Home
          {/*<StudentGeneratorIncident numStudents={50} user={user}/>
          <StudentGenerator user={user} numStudents={50}/>*/}
          <BannerPrincipal/>
          <ClonarColeccion/>
          {user.rol === "admin" ? <AdminView /> : <UserView />}
        </div>)}
    </div>
  );
}

export default Home;

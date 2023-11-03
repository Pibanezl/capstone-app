import React from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import BannerPrincipal from '../components/banner-principal';
/*import StudentGenerator from "../components/generator-students"
import StudentGeneratorIncident from "../components/generator-incident-student"*/
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
          {/*<StudentGeneratorIncident numStudents={50} user={user}/>
          <StudentGenerator user={user} numStudents={50}/>*/}
          <BannerPrincipal/>
          {user.rol === "admin" ? <AdminView /> : <UserView />}
        </div>)}
    </div>
  );
}

export default Home;

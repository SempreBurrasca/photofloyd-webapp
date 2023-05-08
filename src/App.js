import * as React from "react";
import "./App.css";
import Login from "./Routes/Login/Login";
import { BrowserRouter, Route, Routes,} from "react-router-dom";
import Home from "./Routes/Home/Home";
import DashboardPostazioni from "./Componenti/Dashboard/DashboardPostazioni";
import DashboardStaff from "./Componenti/Dashboard/DashboardStaff";
import DashboardFinanze from "./Componenti/Dashboard/DashboardFinanze";
import DashboardImpostazioni from "./Componenti/Dashboard/DashboardImpostazioni";
import DashboardAiuto from "./Componenti/Dashboard/DashboardAiuto";
import Profilo from "./Routes/Profilo/Profilo";
import Postazione from "./Routes/Postazione/Postazione";

function App(props) {

  return (
    <BrowserRouter basename="/app">
      <div className="App">
        <Routes>
          <Route path="/" element={<Home db={props.db} />}>
            <Route path="/" element={<DashboardPostazioni db={props.db} />} />
            <Route path="staff" element={<DashboardStaff />} />
            <Route path="finanze" element={<DashboardFinanze />} />
            <Route path="impostazioni" element={<DashboardImpostazioni />} />
            <Route path="aiuto" element={<DashboardAiuto />} />
          </Route>
          <Route path="/postazione/:postazioneId" element={<Postazione db={props.db}/>}/>
          <Route path="/auth" element={<Login />} />
          <Route path="/profilo" element={<Profilo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

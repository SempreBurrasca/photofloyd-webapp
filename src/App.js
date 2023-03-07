import * as React from "react";
import "./App.css";
import Login from "./Routes/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, ToastQueue } from "@react-spectrum/toast";
import Home from "./Routes/Home/Home";
import DashboardPostazioni from "./Componenti/Dashboard/DashboardPostazioni";
import DashboardStaff from "./Componenti/Dashboard/DashboardStaff";
import DashboardFinanze from "./Componenti/Dashboard/DashboardFinanze";
import DashboardImpostazioni from "./Componenti/Dashboard/DashboardImpostazioni";
import DashboardAiuto from "./Componenti/Dashboard/DashboardAiuto";
import { Button } from "@adobe/react-spectrum";
import Profilo from "./Routes/Profilo/Profilo";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<DashboardPostazioni />} />
            <Route path="staff" element={<DashboardStaff />} />
            <Route path="finanze" element={<DashboardFinanze />} />
            <Route path="impostazioni" element={<DashboardImpostazioni />} />
            <Route path="aiuto" element={<DashboardAiuto />} />
          </Route>
          <Route path="/auth" element={<Login />} />
          <Route path="/profilo" element={<Profilo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

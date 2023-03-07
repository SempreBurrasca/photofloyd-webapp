import * as React from "react";
import "./App.css";
import Login from "./Routes/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, ToastQueue } from "@react-spectrum/toast";
import Home from "./Routes/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<h1>Postazioni</h1>} />
            <Route path="staff" element={<h1>Staff</h1>} />
            <Route path="finanze" element={<h1>Finanze</h1>} />
            <Route path="impostazioni" element={<h1>Impostazioni</h1>} />
            <Route path="aiuto" element={<h1>Aiuto</h1>} />
          </Route>
          <Route path="/auth" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

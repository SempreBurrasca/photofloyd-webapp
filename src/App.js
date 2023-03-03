import * as React from "react";
import "./App.css";
import Login from "./Routes/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

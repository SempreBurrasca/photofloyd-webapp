import * as React from "react";
import * as ReactDOM from "react-dom";
import "./App.css";
import Login from "./Routes/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<h1>ciao</h1>} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

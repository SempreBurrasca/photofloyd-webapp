import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";

import LayoutDiSezione from "../../Layouts/LayoutDiSezione";

function Profilo() {
  const navigate = useNavigate();
  useEffect(() => {});

  return (
    <LayoutDiSezione>
      <h1>Profilo</h1>
    </LayoutDiSezione>
  );
}

export default Profilo;

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";

import LayoutConHeader from "../../Layouts/LayoutConHeader";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    verificaAutenticazione();
  });

  let verificaAutenticazione = async () => {
    const auth = getAuth();
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("Autenticato", user);
      } else {
        // User is signed out
        // ...
        console.log("Non autenticato");
        navigate("/auth");
      }
    });
  };
  return (
    <LayoutConHeader>
      <Outlet />
    </LayoutConHeader>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";

import LayoutConHeader from "../../Layouts/LayoutConHeader";
import { ToastQueue } from "@react-spectrum/toast";

function Home(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getAuth().currentUser) {
      verificaAutenticazione();
    }
  }, []);

  let verificaAutenticazione = async () => {
    const auth = getAuth();
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("Autenticato", user, "da Homepage");
        ToastQueue.positive("Autenticazione avvenuta con successo", {
          timeout: 5000,
        });
      } else {
        // User is signed out
        // ...
        console.log("Non autenticato");
        navigate("/auth");
        ToastQueue.negative("Non sei autenticato", { timeout: 5000 });
      }
    });
  };
  return (
    <LayoutConHeader db={props.db}>
      <Outlet />
    </LayoutConHeader>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    verificaAutenticazione()
  });

  let verificaAutenticazione = async () => {
    const auth = getAuth();
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("Autenticato",user)
      } else {
        // User is signed out
        // ...
        console.log("Non autenticato")
        navigate("/auth")
      }
    });
  };
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export default Home;

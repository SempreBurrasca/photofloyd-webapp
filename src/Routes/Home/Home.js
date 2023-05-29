import React, { useState, useEffect, useReducer, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";

import LayoutConHeader from "../../Layouts/LayoutConHeader";
import { ToastQueue } from "@react-spectrum/toast";
import { initialState, reducer } from "../../Reducers/reducer";
import { StateContext } from "../../Context/stateContext";
import { getTasseDocuments } from "../../Functions/firebaseGetFunctions";

function Home(props) {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(StateContext);
  useEffect(() => {
    verificaAutenticazione();
    getTasseDocuments().then((_taxes) => {
      dispatch({ type: "SET_TAXES", taxes: _taxes });
    });

    console.log("state=>", state);
  }, []);

  const verificaAutenticazione = async () => {
    const auth = getAuth();
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const _uid = user.uid;
        console.log("Autenticato", user, "da Homepage");
        dispatch({ type: "SET_AUTH", isAuth: true, userId: _uid });
        ToastQueue.positive("Autenticazione avvenuta con successo", {
          timeout: 1000,
        });
      } else {
        // User is signed out
        console.log("Non autenticato");
        dispatch({ type: "SET_AUTH", isAuth: false, userId: null });
        navigate("/auth");
        ToastQueue.negative("Non sei autenticato", { timeout: 1000 });
      }
    });
  };
  return (
    <LayoutConHeader db={props.db}>
      {state.isAuth && <Outlet />}
    </LayoutConHeader>
  );
}

export default Home;

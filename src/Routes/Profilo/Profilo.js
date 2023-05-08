import React, { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";

import LayoutDiSezione from "../../Layouts/LayoutDiSezione";
import { ActionButton, Flex, TextField, Well } from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";

function Profilo() {
  useEffect(() => {
    if (user !== null) {
      setUtente(user);
      console.log(utente);
    }
  }, []);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [utente, setUtente] = useState({});
  const [password, setPassword] = React.useState();
  const [newData, setNewData] = React.useState({
    displayName:  auth.currentUser.displayName,
    email:  auth.currentUser.email,
    phoneNumber:  auth.currentUser.phoneNumber,
  });

  const recuperoPassword = () => {
    sendPasswordResetEmail(auth, utente.email)
      .then(() => {
        // Password reset email sent!
        // ..
        console.log("Email Inviata con successo");
        ToastQueue.positive("Abbiamo inviato una mail per la reimpostazione della password",{timeout:5000})
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        ToastQueue.negative(errorMessage,{timeout:5000})
        // ..
      });
  };

  const aggiornaProfilo = () => {
    updateProfile(auth.currentUser, {
      displayName: newData.displayName,
      phoneNumber: newData.phoneNumber,
    })
      .then(() => {
        // Profile updated!
        // ...
        console.log("Profilo Aggiornato",{
          displayName: newData.displayName,
          phoneNumber: newData.phoneNumber,
        });
        setUtente(user);
        ToastQueue.positive("Profilo Aggiornato",{timeout:5000})
      })
      .catch((error) => {
        // An error occurred
        // ...
        console.log(error);
        ToastQueue.negative(error.message,{timeout:5000})
      });
  };

  return (
    <LayoutDiSezione>
      <h1>Ciao {utente.displayName ? utente.displayName : utente.email}</h1>

      <Flex direction="column" gap="size-200">
        <Well>
          Da questa pagina puoi modificare i dati inerenti al tuo profilo.
        </Well>
        <TextField
          label="Nome Utente"
          type="text"
          width={"100%"}
          value={newData.displayName}
          onChange={(value) => {
            setNewData({ ...newData, displayName: value });
          }}
        />
        <TextField
          label="Telefono"
          type="text"
          width={"100%"}
          value={newData.phoneNumber}
          onChange={(value) => {
            setNewData({ ...newData, phoneNumber: value });
          }}
        />

        <ActionButton onPress={aggiornaProfilo}>
          Salva Informazioni
        </ActionButton>
        <ActionButton onPress={recuperoPassword}>
          Recupera Password
        </ActionButton>
      </Flex>
    </LayoutDiSezione>
  );
}

export default Profilo;

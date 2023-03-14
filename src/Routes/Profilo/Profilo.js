import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";

import LayoutDiSezione from "../../Layouts/LayoutDiSezione";
import { ActionButton, Flex, TextField, Well } from "@adobe/react-spectrum";

function Profilo() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [utente, setUtente] = useState({});
  const [password,setPassword]=React.useState()

  useEffect(() => {
    if (user !== null) {
      setUtente(user);
    }
  });

  return (
    <LayoutDiSezione>
      <h1>Ciao {utente.displayName ? utente.displayName : utente.email}</h1>

      <Flex direction="column" gap="size-200">
        <Well>
          Da questa pagina puoi modificare i dati inerenti al tuo profilo.
        </Well>
        <TextField label="Nome Utente" type="text" width={"100%"} />
        <TextField
          label="Email"
          type="email"
          width={"100%"}
          value={utente.email}
        />
        <TextField
          label="Password"
          type="password"
          width={"100%"}
          value={password}
        />
        <ActionButton isDisabled>Salva Informazioni</ActionButton>
      </Flex>
    </LayoutDiSezione>
  );
}

export default Profilo;

import React, { useContext, useEffect, useReducer } from "react";
import {
  Flex,
  Heading,
  Text,
  Well,
  DialogContainer,
  Dialog,
  Content,
  ProgressCircle,
} from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import TabellaPostazioni from "../Tabelle/TabellaPostazioni";
import { ToastQueue } from "@react-spectrum/toast";
import { getUserPostazioni } from "../../Functions/firebaseGetFunctions";
import {
  initialAuthState,
  initialState,
  reducer,
  reducerAuth,
} from "../../Reducers/reducer";
import { StateContext } from "../../Context/stateContext";
function DashboardPostazioni(props) {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = props.db;
  let [postazioniUtente, setPostazioniUtente] = React.useState([]);
  const [isOpen, setOpen] = React.useState(false);
  const [textLoad, setTextLoad] = React.useState("Caricamento in corso");
  const { state, dispatch } = useContext(StateContext);

  React.useEffect(() => {
    
    if (state.isAuth) {
      console.log("state DP=>", state);
      getUserPostazioni(state.userId, (postazioni) => {
        setPostazioniUtente(postazioni);
        setOpen(false);
      });
    }
    dispatch({ type: "SET_FOTO_POSTAZIONE", fotoPostazione: [] });
  }, [state.isAuth]);
  useEffect(() => {
    console.log("postazioniUtente=>", postazioniUtente);
  }, [postazioniUtente]);

  const getUid = async () => {
    try {
      setOpen(true);
      let uid = getAuth().currentUser.uid;
      console.log("uid=>", uid);
      return uid;
    } catch (error) {
      console.log(error);
    }
  };
  //da capire come far effettuare il rendering della tabella postazioni non appena si hanno i dati
  return (
    <Flex direction={"column"} alignItems={"center"} >
      <Heading level={3}>
        Ciao {auth.currentUser ? auth.currentUser.displayName : ""}, seleziona
        la postazione dalla quale lavorare.
      </Heading>
      {postazioniUtente && postazioniUtente.length > 0 ? (
        <TabellaPostazioni postazioni={postazioniUtente} />
      ) : (
        <Text>Non hai nessuna postazione su cui lavorare </Text>
      )}
      <DialogContainer {...props} isDismissable={false}>
        {isOpen && (
          <Dialog>
            <Content>
              <Flex direction="column">
                <Text>{textLoad}</Text>
                <ProgressCircle aria-label="Loading…" isIndeterminate />
              </Flex>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </Flex>
  );
}

export default DashboardPostazioni;

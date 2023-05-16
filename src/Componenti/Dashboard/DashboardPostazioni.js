import React from "react";
import { Flex, Heading, Text, Well } from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import TabellaPostazioni from "../Tabelle/TabellaPostazioni";
import { ToastQueue } from "@react-spectrum/toast";
import { getUserPostazioni } from "../../Functions/firebaseGetFunctions";
function DashboardPostazioni(props) {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = props.db;
  let [postazioniUtente, setPostazioniUtente] = React.useState([]);
  React.useEffect(() => {
  
    getUid().then((uid) => {
      getUserPostazioni(uid).then((postazioni) => {
        setPostazioniUtente(postazioni);
        console.log(  "postazioni=>",postazioni)
      });
    })
   
  }, []);

  const getUid = async () => {
    try {
      let uid = await getAuth().currentUser.uid;
      return uid;
    } catch (error) {
      console.log(error);
    }
  };
  //da capire come far effettuare il rendering della tabella postazioni non appena si hanno i dati
  return (
    <Flex direction={"column"} minHeight="100vh" alignItems={"center"}>
      <Heading level={3}>
        Ciao {auth.currentUser ? auth.currentUser.displayName : ""}, seleziona
        la postazione dalla quale lavorare.
      </Heading>
      {postazioniUtente && postazioniUtente.length > 0 ? (
        <TabellaPostazioni postazioni={postazioniUtente} />
      ) : (
        <Text>Non hai nessuna postazione su cui lavorare </Text>
      )}
    </Flex>
  );
}

export default DashboardPostazioni;

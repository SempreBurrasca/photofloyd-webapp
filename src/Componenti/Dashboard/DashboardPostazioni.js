import React from "react";
import { Flex, Heading, Text, Well } from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import TabellaPostazioni from "../Tabelle/TabellaPostazioni";
import { ToastQueue } from "@react-spectrum/toast";
function DashboardPostazioni(props) {
  React.useEffect(() => {
    recuperaPostazioni();
  }, []);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = props.db;
  let [postazioniUtente, setPostazioniUtente] = React.useState([]);

  const getUserUid = async () => {
    return await auth.currentUser;
  };
  const getPostazioneDocs = async (e) => {
    const collectionRef = collection(db, "users", e, "postazioni");
    const querySnapshot = await getDocs(collectionRef);
    var arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        data: doc.data(),
      });
      setPostazioniUtente(arr);
    });
  };
  const recuperaPostazioni = async () => {
    var user = auth.currentUser;
    getUserUid()
      .then((user) => {
        console.log(user.uid, "ciao");
        getPostazioneDocs(user.uid)
          .then((e) => {
            ToastQueue.positive("Postazioni recuperate con successo", {
              timeout: 1000,
            });
          })
          .catch((e) => {
            console.log(e, "errore");
            ToastQueue.negative(e.message, {
              timeout: 1000,
            });
            
          });
      })
      .catch((e) => {
        console.log(e, "errore");
      });
  };
  //da capire come far effettuare il rendering della tabella postazioni non appena si hanno i dati
  return (
    <Flex direction={"column"} minHeight="100vh" alignItems={"center"}>
      <Heading level={3}>
        Ciao {auth.currentUser ? auth.currentUser.displayName : ""}, seleziona
        la postazione dalla quale lavorare.
      </Heading>
      {postazioniUtente.length > 1 ? (
        <TabellaPostazioni postazioni={postazioniUtente} />
      ) : (
        <Text>Non hai nessuna postazione su cui lavorare </Text>
      )}
    </Flex>
  );
}

export default DashboardPostazioni;

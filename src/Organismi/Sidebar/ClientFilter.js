import React, { useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import {
  ActionButton,
  ActionGroup,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Grid,
  Header,
  Heading,
  Item,
  TabList,
  TabPanels,
  Tabs,
  Text,
  View,
  Well,
} from "@adobe/react-spectrum";

import {
  getCartelle,
  getPhotoNames,
  getPhotoNamesByClient,
} from "../../Functions/firebaseFunctions";
import { getClienti } from "../../Functions/firebaseGetFunctions";
import { makeId } from "../../Functions/logicArray";
import { StateContext } from "../../Context/stateContext";

function ClientFilter(props) {
  const { state, dispatch } = useContext(StateContext);
  let [selected, setSelected] = React.useState([]);
  let [clients, setClients] = useState([]);
  let [selectedClient, setSelectedClient] = useState(null); // aggiungi questo stato
  const { reset } = props;
  //recupero i clienti della postazione
  useEffect(() => {
    getClienti(props.db, props.postazioneId, setClients);
  }, []);
  // resetta la selezione del ComboBox
  useEffect(() => {
    setSelectedClient(null);
  }, [reset]);
  //gestisco il filtro
  const handleSelection = async (e) => {
    if (e) {
      console.log("CLIENTE=>", e);
      await getPhotoNamesByClient(props.db, e, props.postazioneId)
        .then((photos) => {
          dispatch({
            type: "SET_FILTER_CLIENT",
            client: photos,
          });
        })
        .catch((e) => console.log(e));
    } else {
      dispatch({
        type: "SET_FILTER_CLIENT",
        client: false,
      });
    }
  };
  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5} margin={0}>
        Filtra per Cliente
      </Heading>
      {clients && clients.length > 0 && (
        <ComboBox
          items={clients}
          selectedKey={selectedClient} // usa selectedClient come selectedKey
          onSelectionChange={(key) => {
            setSelectedClient(key);
            handleSelection(key);
          }} // aggiorna selectedClient quando cambia la selezione
          width={"100%"}
        >
          {(item) => <Item key={item.id}>{item.id}</Item>}
        </ComboBox>
      )}
    </Flex>
  );
}

export default ClientFilter;

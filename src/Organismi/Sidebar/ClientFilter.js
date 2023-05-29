import React, { useState, useEffect } from "react";
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

import { getCartelle, getPhotoNames, getPhotoNamesByClient } from "../../Functions/firebaseFunctions";
import { getClienti } from "../../Functions/firebaseGetFunctions";
import { makeId } from "../../Functions/logicArray";

function ClientFilter(props) {
  let [selected, setSelected] = React.useState([]);
  let [clients, setClients] = useState([]);
  useEffect(() => {
    getClienti(props.db, props.postazioneId, setClients);
  }, []);
  const setFilteredPhotos = props.setFilteredPhotos;
  const filterFotos = async (target) => {
    if(target.length===0){
      setFilteredPhotos([])
      await setSelected(target);
    }else{
      await getPhotoNamesByClient(props.db,target,props.postazioneId).then((e)=>{setFilteredPhotos(props.filteredPhotos.concat(e))})
      await setSelected(target);
    }
   
  };
  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5} margin={0}>Filtra per Cliente</Heading>
      <CheckboxGroup value={selected} onChange={filterFotos}>
        {clients &&
          clients.length > 0 &&
          clients.map((client) => (
            <Checkbox key={client.id+"-"+makeId(3)} value={client.id}>
              {client.id}
            </Checkbox>
          ))}
      </CheckboxGroup>
    </Flex>
  );
}

export default ClientFilter;

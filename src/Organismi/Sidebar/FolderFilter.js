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

import { getCartelle, getPhotoNames } from "../../Functions/firebaseFunctions";

function FolderFilter(props) {
  let [selected, setSelected] = React.useState([]);
  let [folders, setFolders] = useState([]);
  useEffect(() => {
    getCartelle(props.db, props.postazioneId, setFolders);
  }, []);
  const setFilteredPhotos = props.setFilteredPhotos;
  const filterFotos = async (target) => {
    if(target.length===0){
      setFilteredPhotos([])
      await setSelected(target);
    }else{
      await getPhotoNames(props.db,target,props.postazioneId).then((e)=>{setFilteredPhotos(props.filteredPhotos.concat(e))})
      await setSelected(target);
    }
   
  };
  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5}>Filtra per cartella</Heading>
      <CheckboxGroup value={selected} onChange={filterFotos}>
        {folders &&
          folders.length > 0 &&
          folders.map((folder) => (
            <Checkbox key={folder.data.name} value={folder.data.name}>
              {folder.data.name}
            </Checkbox>
          ))}
      </CheckboxGroup>
    </Flex>
  );
}

export default FolderFilter;

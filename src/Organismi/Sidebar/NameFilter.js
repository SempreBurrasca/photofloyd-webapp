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
  TextField,
  View,
  Well,
} from "@adobe/react-spectrum";

import { getCartelle, getPhotoNames } from "../../Functions/firebaseFunctions";
import Checkmark from "@spectrum-icons/workflow/Checkmark";
import Help from "@spectrum-icons/workflow/Help";
import Cancel from "@spectrum-icons/workflow/Cancel";

function NameFilter(props) {
  let [selected, setSelected] = React.useState([]);
  let [folders, setFolders] = useState([]);
  useEffect(() => {
    getCartelle(props.db, props.postazioneId, setFolders);
  }, []);
  const setFilteredPhotos = props.setFilteredPhotos;
  const filterFotos = async (target) => {
    if (props.filteredPhotos.length > 0) {
      console.log(target, props.filteredPhotos);
    }
    await setSelected(target);
  };
  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5} margin={0}>Filtra per nome</Heading>
      <TextField width={"100%"}/>
    </Flex>
  );
}

export default NameFilter;

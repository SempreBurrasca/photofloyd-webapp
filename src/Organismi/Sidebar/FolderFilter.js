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

import { getCartelle } from "../../Functions/firebaseFunctions";

function FolderFilter(props) {
  let [selected, setSelected] = React.useState([]);
  let [folders, setFolders] = useState([]);
  useEffect(() => {
    getCartelle(props.db, props.postazioneId, setFolders);
  }, []);
  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5}>Filtra per cartella</Heading>
      <CheckboxGroup value={selected} onChange={setSelected}>
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

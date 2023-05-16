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
  Image,
  Item,
  Menu,
  MenuTrigger,
  Picker,
  Switch,
  TabList,
  TabPanels,
  Tabs,
  Text,
  TextField,
  View,
  Well,
} from "@adobe/react-spectrum";
import { getEdits } from "../../Functions/firebaseGetFunctions";

function Fotografia(props) {
  const {
    foto,
    postazioneId,
    setIsSelectedEdit,
    setEditSelected,
    isSelectedEdit,
    editSelected,
  } = props;
  const [productIsSelected, setProductIsSelected] = useState(false);
  const [edits, setEdits] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState();
  useEffect(() => {
    getEdits(postazioneId, foto.id).then((_edits) => {
      setEdits([{ id: "original", name: "Originale" }, ..._edits]);
    });
  }, [foto]);
  
  useEffect(() => {
  }, [editSelected]);

  const handleSelection = (e) => {
    setSelectedVersion(e);
    if (e !== "Originale") {
      setIsSelectedEdit(true);
      edits.forEach((_edit) => {
        if (_edit.name !== e) {
        } else {
          _edit.selected = true;
          setEditSelected(_edit);
          console.log(_edit, editSelected);
        }
      });
    } else {
      setIsSelectedEdit(false);
      setEditSelected(foto);
    }
  };
  return (
    <Flex direction={"column"} gap={"size-115"} alignItems={"center"}>
      {edits.length > 0 && (
        <Picker
          label="Scegli una versione"
          items={edits}
          onSelectionChange={handleSelection}
          isDisabled={edits.length > 1 ? false : true}
        >
          {(item) => <Item key={item.name}>{item.name}</Item>}
        </Picker>
      )}
      <Image
        src={edits.length > 0 && isSelectedEdit ? editSelected.url : foto.data.url}
        height={props.height}
        objectFit={props.objectFit}
      />
    </Flex>
  );
}

export default Fotografia;

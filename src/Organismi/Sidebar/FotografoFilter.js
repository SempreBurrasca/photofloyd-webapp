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

function FotografoFilter(props) {
  const { state, dispatch } = useContext(StateContext);
  const {reset}=props
  let [selected, setSelected] = React.useState(false);
  let [fotografi, setFotografi] = useState([]);
  useEffect(() => {
    setFotografi(saarr())
  }, [state.fotoPostazione]);
  useEffect(() => {
    if (selected) {
      dispatch({
        type: "SET_FILTER_FOTOGRAFO",
        fotografo: selected,
      });
    } else {
      dispatch({
        type: "SET_FILTER_FOTOGRAFO",
        fotografo: false,
      });
    }
  }, [selected]);
  useEffect(() => {
    setSelected(null);
  }, [reset]);

  const getUniquePhotographerNames = (photos) => {
    const photographerNames = photos.map((photo) => photo.data.fotografo.nome);
    return [...new Set(photographerNames)];
  };
  const saarr=()=>{
    let arr=[]
    getUniquePhotographerNames(state.fotoPostazione).forEach((f)=>{
      arr.push({name:f})
    })
    return arr
  }
  const handleSelection = async (e) => {
    if (e) {
      setSelected(e);
    } else {
      setSelected(false);
    }
  };
  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5} margin={0}>
        Filtra per Fotografo
      </Heading>
      {fotografi && fotografi.length > 0 && (
        <ComboBox
          defaultItems={fotografi}
          onSelectionChange={handleSelection}
          selectedKey={selected}
          width={"100%"}
        >
          {(item) => <Item key={item.name}>{item.name}</Item>}
        </ComboBox>
      )}
    </Flex>
  );
}

export default FotografoFilter;

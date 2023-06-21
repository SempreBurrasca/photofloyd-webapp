import React, { useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import {
  Divider,
  Flex,
  Grid,
  Item,
  TabList,
  TabPanels,
  Tabs,
  View,
} from "@adobe/react-spectrum";

import GrigliaFotografie from "../../Componenti/Fotografie/GrigliaFotografie";
import { ToastQueue } from "@react-spectrum/toast";
import {
  getPostazioneDoc,
  getTagsFromFirebase,
} from "../../Functions/firebaseFunctions";

import {
  getSalesByPostazione,
  getTagsFromSettingsPostazione,
} from "../../Functions/firebaseGetFunctions";
import PostazioneImpostazioni from "./PostazioneImpostazioni";
import { StateContext } from "../../Context/stateContext";
import SidebarFilter from "./Sidebar/SidebarFilter.js";
import SidebarActions from "./Sidebar/SidebarActions";
import ContentHeading from "./Content/ContentHeading";

function Postazione(props) {
  const { state, dispatch } = useContext(StateContext);
  const [selectedFotos, setSelectedFotos] = useState([]);
  const [cartFotos, setCartFotos] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  let { postazioneId } = useParams();
  let [postazione, setPostazione] = React.useState(null);
  const [filteredPhotos, setFilteredPhotos] = React.useState([]);
  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [fotoToEdit, setFotoToEdit] = useState({});
  const [vendite, setVendite] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reset, setReset] = useState(false);
  React.useEffect(() => {
    setSelectedFotos([]);
    setCartFotos([]);
    getPostazioneDoc(props.db, postazioneId, setPostazione, dispatch)
      .then((e) => {
        ToastQueue.positive(e, {
          timeout: 2000,
        });
      })
      .catch((e) => {
        ToastQueue.negative(e, {
          timeout: 2000,
        });
      });
    getTagsFromSettingsPostazione(postazioneId).then((__tags) => {
      if (__tags) {
        let arr = [];
        __tags.forEach((t) => {
          arr.push({
            id: t.replace(/\s+/g, ""),
            name: t.replace(/\s+/g, ""),
          });
        });
        setAvailableTags(arr);
        console.log("Tag dalle impostazioni=>", arr);
      } else {
        getTagsFromFirebase(props.db).then((tags) => {
          setAvailableTags(tags);
        });
      }
    });
  }, []);

  useEffect(() => {
    getSalesByPostazione(postazioneId).then((vendite) => {
      setVendite(vendite);
    });
  }, [openSellDialog]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  const resetFilter = () => {
    dispatch({
      type: "SET_FILTER_TAGS",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_CLIENT",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_LABEL",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_DATA",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_FOTOGRAFO",
      tags: false,
    });
    setReset(true);
  };

  return (
    <LayoutConHeader>
      <Grid
        areas={["sidebar divider content"]}
        columns={["1.5fr", "0.03fr", "8fr"]}
        gap="size-100"
        margin={10}
      >
        <View gridArea="sidebar" overflow={"hidden"}>
          <Flex direction="column" gap="size-200">
            <SidebarActions
              selectedFotos={selectedFotos}
              setOpenSellDialog={setOpenSellDialog}
              setIsEditMode={setIsEditMode}
              db={props.db}
              setSelectedFotos={setSelectedFotos}
              availableTags={availableTags}
              openSellDialog={openSellDialog}
              cartFotos={cartFotos}
              setCartFotos={setCartFotos}
            />
            <Divider size="M" />
            <View overflow={"auto"} paddingBottom={50}>
              <SidebarFilter
                db={props.db}
                filteredPhotos={filteredPhotos}
                setFilteredPhotos={setFilteredPhotos}
                availableTags={availableTags}
                setAvailableTags={setAvailableTags}
              />
            </View>
          </Flex>
        </View>

        <Divider orientation="vertical" size="M" />

        <View gridArea="content" overflow={"auto"}>
          <Flex direction="column" gap="size-200" justifyContent={"center"}>
            <ContentHeading
              openEditDialog={openEditDialog}
              setOpenEditDialog={setOpenEditDialog}
              fotoToEdit={fotoToEdit}
              db={props.db}
              postazioneId={postazioneId}
              setFotoToEdit={setFotoToEdit}
              postazione={postazione}
              availableTags={availableTags}
            />
            <Tabs
              aria-label="Menu della dashboard generale"
              isEmphasized
              defaultSelectedKey="Fotografie"
            >
              <TabList>
                <Item key="Fotografie">Fotografie</Item>
                <Item key="Impostazioni">Impostazioni</Item>
                <Item key="Finanze">Finanze</Item>
              </TabList>
              <TabPanels>
                <Item key="Fotografie">
                  <GrigliaFotografie
                    db={props.db}
                    postazioneId={postazioneId}
                    setSelectedFotos={setSelectedFotos}
                    selectedFotos={selectedFotos}
                    filteredPhotos={filteredPhotos}
                    availableTags={availableTags}
                    fotoToEdit={fotoToEdit}
                    setFotoToEdit={setFotoToEdit}
                    setOpenEditDialog={setOpenEditDialog}
                    isEditMode={isEditMode}
                  />
                </Item>
                <Item key="Impostazioni">
                  <PostazioneImpostazioni
                    db={props.db}
                    postazioneId={postazioneId}
                  />
                </Item>
                {/* <Item key="Finanze">
                  <TabellaVenditePostazione vendite={vendite} />
                </Item>*/}
              </TabPanels>
            </Tabs>
          </Flex>
        </View>
      </Grid>
    </LayoutConHeader>
  );
}

export default Postazione;

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
import Star from "@spectrum-icons/workflow/Star";
import Label from "@spectrum-icons/workflow/Label";
import Folder from "@spectrum-icons/workflow/Folder";
import Shop from "@spectrum-icons/workflow/Shop";
import Delete from "@spectrum-icons/workflow/Delete";
import { TagGroup } from "@react-spectrum/tag";
import { makeId } from "../../Functions/logicArray";
import ImageAdd from "@spectrum-icons/workflow/ImageAdd";
import GrigliaFotografie from "../../Componenti/Fotografie/GrigliaFotografie";
import { ToastQueue } from "@react-spectrum/toast";
import {
  saveToBrowserStorage,
  uploadFotoFinal,
} from "../../Functions/uploadFileToServer";
import { uploadToIndexedDB } from "../../Functions/IndexedDB";
import TabellaFotoInUpload from "../../Organismi/TabellaFotoInUpload.js/TabellaFotoInUpload";
import { savePhotosToFirebase, updatePhotoTags } from "../../Functions/firebaseFunctions";
import { containsObject } from "../../Functions/tools";

function DialogAddTag(props) {
  const { close, selectedFotos } = props;
  const [selectedTags, setSelectedTags] = useState([]);
  const availableTags = [
    { id: 1, name: "Tag1" },
    { id: 2, name: "Tag2" },
    { id: 3, name: "Tag3" },
  ];
  //manca da completare la logica che impedisca duplicati
  const selezionaTag = (item) => {
    setSelectedTags(selectedTags.concat({ id: item, name: item }));
  };
  const aggiornaTag = async () => {
    console.log(selectedFotos);
    console.log(selectedTags);
    await updatePhotoTags(props.db,selectedFotos,selectedTags,props.postazioneId)
  };
  return (
    <Dialog>
      <Heading>Aggiungi Tag</Heading>
      <Header>Connection status: Connected</Header>
      <Divider />
      <Content>
        <Text>
          Aggiungi i tag a {selectedFotos.length} fotografie, per farlo utilizza
          il form qui sotto.
        </Text>
        <TagGroup
          items={availableTags}
          label="Tag"
          aria-label="Tag selezionabili per la fotografie"
        >
          {(item) => (
            <Item key={item.id}>
              <a
                className={
                  containsObject(selectedTags, {
                    id: item.name,
                    name: item.name,
                  })
                    ? "tag-button active"
                    : "tag-button"
                }
                onClick={() => selezionaTag(item.name)}
              >
                {item.name}
              </a>
            </Item>
          )}
        </TagGroup>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Annulla
        </Button>
        <Button
          variant="accent"
          onPress={() => {aggiornaTag().then(()=>{props.setSelectedFotos([]);close()})}}
        >
          Conferma
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogAddTag;

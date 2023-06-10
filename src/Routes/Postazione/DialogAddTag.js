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
import {
  savePhotosToFirebase,
  updatePhotoTags,
} from "../../Functions/firebaseFunctions";
import { containsObject } from "../../Functions/tools";

function DialogAddTag(props) {
  const { close, selectedFotos, availableTags } = props;
  const [selectedTags, setSelectedTags] = useState([]);

  //manca da completare la logica che impedisca duplicati

  const aggiornaTag = async () => {
    console.log(selectedFotos);
    console.log(selectedTags);
    await updatePhotoTags(
      props.db,
      selectedFotos,
      selectedTags,
      props.postazioneId
    );
  };
  const handleSelectionTags = (e) => {
    let array = selectedTags;
    if (array.includes(e)) {
      const index = array.indexOf(e);
      if (index > -1) {
        // only splice array when item is found
        array.splice(index, 1); // 2nd parameter means remove one item only
        setSelectedTags([...array]);
      }
    } else {
      setSelectedTags([...array, e]);
    }
  };
  return (
    <Dialog>
      <Heading>Aggiungi Tag</Heading>
      <Header>Connection status: Connected</Header>
      <Divider />
      <Content>
        <Flex direction={"column"} gap={"size-200"}>
          <Text>
            Aggiungi i tag a {selectedFotos.length} fotografie, per farlo
            selezionali.
          </Text>
          <ActionGroup
            items={availableTags}
            aria-label="Tag di filtraggio"
            selectionMode="multiple"
            isEmphasized
            onAction={(e) => {
              handleSelectionTags(e);
            }}
          >
            {(item) => (
              <Item key={item.name} onClick={() => console.log("das")}>
                {item.name}
              </Item>
            )}
          </ActionGroup>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Annulla
        </Button>
        <Button
          variant="accent"
          isDisabled={!selectedTags.length>0}
          onPress={() => {
            aggiornaTag().then(() => {
              props.setSelectedFotos([]);
              close();
            });
          }}
        >
          Aggiungi Tag
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogAddTag;

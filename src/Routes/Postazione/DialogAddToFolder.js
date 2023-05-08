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
  addPhotosToFolders,
  getCartelle,
  savePhotosToFirebase,
  updatePhotoTags,
} from "../../Functions/firebaseFunctions";
import { containsObject } from "../../Functions/tools";

function DialogAddToFolder(props) {
  const { close, selectedFotos } = props;
  let [selectedFolders, setSelectedFolders] = React.useState([]);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  useEffect(() => {
    getCartelle(props.db, props.postazioneId, setFolders);
  }, []);

  return (
    <Dialog>
      <Heading>Aggiungi foto alla cartella</Heading>
      <Header>Connection status: Connected</Header>
      <Divider />
      <Content>
        <Text>
          Aggiungi {selectedFotos.length} fotografie a una cartella, puoi
          selezionarne di già esistenti o crearne una nuova.
        </Text>
        <br />

        {folders.length > 0 ? (
          <CheckboxGroup
            label="Cartelle esistenti"
            value={selectedFolders}
            onChange={setSelectedFolders}
          >
            {folders.map((folder) => (
              <Checkbox key={folder.data.name} value={folder.data.name}>{folder.data.name}</Checkbox>
            ))}
          </CheckboxGroup>
        ) : (
          <Text>Non ci sono cartelle.</Text>
        )}
        <br />
        <Text>
          Crea una nuova cartella e aggiungi le foto selezionate a essa.
        </Text>
        <Flex direction="row" gap="size-200" alignItems="end">
          <TextField
            label="Nome Cartella"
            flex={2}
            value={folderName}
            onChange={setFolderName}
          />
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Annulla
        </Button>
        <Button
          variant="accent"
          onPress={() => {
            addPhotosToFolders(
              props.db,
              props.postazioneId,
              selectedFolders.concat([folderName]),
              selectedFotos
            ).then((e) => {props.setSelectedFotos([]);close()});
          }}
        >
          Conferma
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogAddToFolder;

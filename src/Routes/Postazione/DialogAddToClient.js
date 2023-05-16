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
  addPhotosToClients,
  addPhotosToFolders,
  getCartelle,
  savePhotosToFirebase,
  updatePhotoTags,
} from "../../Functions/firebaseFunctions";
import { containsObject } from "../../Functions/tools";
import { getClienti } from "../../Functions/firebaseGetFunctions";

function DialogAddToClient(props) {
  const { close, selectedFotos } = props;
  let [selectedClients, setSelectedClients] = React.useState([]);
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState("");
  useEffect(() => {
    getClienti(props.db, props.postazioneId, setClients);
  }, []);

  return (
    <Dialog>
      <Heading>Collega foto a un cliente</Heading>
      <Header>Connection status: Connected</Header>
      <Divider />
      <Content>
        <Text>
          Aggiungi {selectedFotos.length} fotografie a un cliente, puoi
          selezionarne di già esistenti o crearne una nuovo.
        </Text>
        <br />

        {clients.length > 0 ? (
          <CheckboxGroup
            label="Cartelle esistenti"
            value={selectedClients}
            onChange={setSelectedClients}
          >
            {clients.map((cliente) => (
              <Checkbox key={cliente.id+"-"+makeId(3)} value={cliente.id}>
                {cliente.id}
              </Checkbox>
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
            label="Nome Cliente"
            flex={2}
            value={clientName}
            onChange={setClientName}
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
            addPhotosToClients(
              props.db,
              props.postazioneId,
              selectedClients.concat([clientName]),
              selectedFotos
            ).then((e) => {
              props.setSelectedFotos([]);
              close();
            });
          }}
        >
          Conferma
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogAddToClient;

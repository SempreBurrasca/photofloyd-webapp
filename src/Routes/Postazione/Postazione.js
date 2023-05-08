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
import { savePhotosToFirebase } from "../../Functions/firebaseFunctions";
import DialogAddTag from "./DialogAddTag";
import DialogAddToFolder from "./DialogAddToFolder";
import DialogDeleteFotos from "./DialogDeleteFotos";
import FolderFilter from "../../Organismi/Sidebar/FolderFilter";

function Postazione(props) {
  const [filesToUpload, setFilesToUpload] = useState({
    photos: [],
    folders: [],
  });
  const [selectedFotos, setSelectedFotos] = useState([]);
  React.useEffect(() => {
    getPostazioneDoc()
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
    console.log(postazione);
  }, []);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  let { postazioneId } = useParams();
  let [postazione, setPostazione] = React.useState(null);

  //recupero la postazione
  const getPostazioneDoc = async () => {
    const docRef = doc(props.db, "postazioni", postazioneId);
    const docSnap = await getDoc(docRef);
    try {
      if (docSnap.exists()) {
        await setPostazione(docSnap.data());
        return "Documento recuperato con successo";
      } else {
        // docSnap.data() will be undefined in this case
        return "Non c'è il documento da recuperare (impostazioni=>tag)'";
      }
    } catch (error) {
      return "Errore nel caricamento del documento: " + error;
    }
  };
  //preparo i file per poi caricarli
  const callSetFilesToUpload = async (files) => {
    try {
      await setFilesToUpload(files);
      ToastQueue.positive("File pronti per l'upload", {
        timeout: 2000,
      });
    } catch (error) {
      // handle error
      ToastQueue.negative("Errore:" + error, {
        timeout: 2000,
      });
    }
  };
  return (
    <LayoutConHeader>
      <Grid
        areas={["sidebar divider content"]}
        columns={["1fr", "0.03fr", "3fr"]}
        gap="size-100"
        maxHeight="80vh"
        margin={10}
      >
        <View gridArea="sidebar">
          <Flex direction="column" gap="size-200">
            <Flex direction="column" gap="size-100">
              {selectedFotos.length > 0 ? (
                <Well>
                  <Text>
                    {selectedFotos.length} foto selezionate.
                    <br />
                    Utilizza i tasti qui sotto per compiere operazioni su queste
                    foto.
                  </Text>
                </Well>
              ) : (
                <Text>
                  Seleziona una o più foto per operare azioni multiple.
                </Text>
              )}

              <ActionGroup
                orientation="vertical"
                isJustified
                density="compact"
                isDisabled={selectedFotos.length === 0}
              >
                <DialogTrigger>
                  <Item key="addTag">
                    <Label />
                    <Text>Aggiungi Tag</Text>
                  </Item>
                  {(close) => (
                    <DialogAddTag
                      close={close}
                      selectedFotos={selectedFotos}
                      db={props.db}
                      postazioneId={postazioneId}
                      setSelectedFotos={(e) => setSelectedFotos(e)}
                    />
                  )}
                </DialogTrigger>
                <DialogTrigger>
                  <Item key="addToFolder">
                    <Folder />
                    <Text>Aggiungi a cartella</Text>
                  </Item>
                  {(close) => (
                    <DialogAddToFolder
                      close={close}
                      selectedFotos={selectedFotos}
                      db={props.db}
                      postazioneId={postazioneId}
                      setSelectedFotos={(e) => setSelectedFotos(e)}
                    />
                  )}
                </DialogTrigger>
                <Item key="sellFotos">
                  <Shop />
                  <Text>Vendi</Text>
                </Item>
                <DialogTrigger>
                  <Item key="deleteFotos">
                    <Delete />
                    <Text>Elimina</Text>
                  </Item>
                  {(close) => (
                    <DialogDeleteFotos
                      close={close}
                      selectedFotos={selectedFotos}
                      db={props.db}
                      postazioneId={postazioneId}
                      setSelectedFotos={(e) => setSelectedFotos(e)}
                    />
                  )}
                </DialogTrigger>
              </ActionGroup>
            </Flex>
            <Divider size="M" />
            <Flex direction="column" gap="size-100">
              <Heading>Filtra e Ricerca</Heading>
              <Text>
                Utilizza i seguenti componenti per cercare delle foto specifiche
              </Text>
              <FolderFilter
                db={props.db}
                postazioneId={postazioneId}
                setSelectedFotos={(e) => setSelectedFotos(e)}
              />
            </Flex>
          </Flex>
        </View>

        <Divider orientation="vertical" size="M" />

        <View gridArea="content">
          <Flex direction="column" gap="size-200" justifyContent={"center"}>
            <Flex
              gap="size-100"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Flex direction="column" gap="size-100">
                <Flex gap="size-100" justifyContent="start">
                  <a>Home{">"} </a>
                  <span>{postazione && postazione.name}</span>
                </Flex>
                <h1>{postazione && postazione.name}</h1>
                {postazione && (
                  <TagGroup items={postazione.tag} aria-label="Tag ">
                    {(item, index) => (
                      <Item key={item.id + "-" + makeId(3)}>{item.name}</Item>
                    )}
                  </TagGroup>
                )}
              </Flex>
              <DialogTrigger>
                <ActionButton>
                  <ImageAdd /> Carica Foto
                </ActionButton>
                {(close) => (
                  <Dialog>
                    <Heading>Upload cartella Foto</Heading>
                    <Header>Connection status: Connected</Header>
                    <Divider />

                    <Content>
                      <Heading level={4}>
                        Seleziona la cartella che vuoi caricare dal tuo
                        computer.
                      </Heading>
                      <input
                        type="file"
                        name="photos[]"
                        id="files"
                        multiple="multiple"
                        webkitdirectory="true"
                        accept="image/*"
                      />
                      <TabellaFotoInUpload
                        callSetFilesToUpload={callSetFilesToUpload}
                      />
                    </Content>
                    <ButtonGroup>
                      <Button variant="secondary" onPress={close}>
                        Cancel
                      </Button>
                      <Button
                        variant="accent"
                        isDisabled={filesToUpload.photos.length === 0}
                        onPress={() =>
                          uploadFotoFinal(filesToUpload).then((data) => {
                            savePhotosToFirebase(
                              props.db,
                              filesToUpload,
                              postazioneId
                            );
                            close();
                          })
                        }
                      >
                        Conferma
                      </Button>
                    </ButtonGroup>
                  </Dialog>
                )}
              </DialogTrigger>
            </Flex>
            <Tabs
              aria-label="Menu della dashboard generale"
              isEmphasized
              onSelectionChange={(key) => console.log(key)}
              defaultSelectedKey="Fotografie"
            >
              <TabList>
                <Item key="Fotografie">Fotografie</Item>
                <Item key="Staff">Staff</Item>
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
                  />
                </Item>
                <Item key="Staff">
                  <span>Staff</span>
                </Item>
                <Item key="Impostazioni">
                  <span>Impostazioni</span>
                </Item>
                <Item key="Finanze">
                  <span>Finanze</span>
                </Item>
              </TabPanels>
            </Tabs>
          </Flex>
        </View>
      </Grid>
    </LayoutConHeader>
  );
}

export default Postazione;

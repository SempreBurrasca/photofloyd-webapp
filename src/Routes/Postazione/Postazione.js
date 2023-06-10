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
  Content,
  Dialog,
  DialogContainer,
  DialogTrigger,
  Divider,
  Flex,
  Grid,
  Header,
  Heading,
  Item,
  Switch,
  TabList,
  TabPanels,
  Tabs,
  Text,
  View,
  Well,
} from "@adobe/react-spectrum";
import Label from "@spectrum-icons/workflow/Label";
import Shop from "@spectrum-icons/workflow/Shop";
import Delete from "@spectrum-icons/workflow/Delete";
import { TagGroup } from "@react-spectrum/tag";
import { makeId } from "../../Functions/logicArray";
import ImageAdd from "@spectrum-icons/workflow/ImageAdd";
import GrigliaFotografie from "../../Componenti/Fotografie/GrigliaFotografie";
import { ToastQueue } from "@react-spectrum/toast";
import { uploadFotoFinal } from "../../Functions/uploadFileToServer";
import TabellaFotoInUpload from "../../Organismi/TabellaFotoInUpload.js/TabellaFotoInUpload";
import {
  getTagsFromFirebase,
  savePhotosToFirebase,
} from "../../Functions/firebaseFunctions";
import DialogAddTag from "./DialogAddTag";
import DialogDeleteFotos from "./DialogDeleteFotos";
import LabelFilter from "../../Organismi/Sidebar/LabelFilter";
import NameFilter from "../../Organismi/Sidebar/NameFilter";
import DialogSellFotos from "./DialogSellFotos";
import DialogAddToClient from "./DialogAddToClient";
import FolderUser from "@spectrum-icons/workflow/FolderUser";
import ClientFilter from "../../Organismi/Sidebar/ClientFilter";
import DialogEditFoto from "./DialogEditFoto";
import TabellaVenditePostazione from "../../Componenti/Tabelle/TabellaVenditePostazione";
import {
  getSalesByPostazione,
  getTagsFromSettingsPostazione,
} from "../../Functions/firebaseGetFunctions";
import PostazioneImpostazioni from "./PostazioneImpostazioni";
import { StateContext } from "../../Context/stateContext";
import TagsFilter from "../../Organismi/Sidebar/TagsFilter";
import DataFilter from "../../Organismi/Sidebar/DataFilter";

function Postazione(props) {
  const { state, dispatch } = useContext(StateContext);
  const [filesToUpload, setFilesToUpload] = useState({
    photos: [],
    folders: [],
  });
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
  const [isWebkitDirectory, setIsWebkitDirectory] = useState(false);
  React.useEffect(() => {
    setSelectedFotos([]);
    setCartFotos([]);
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
        columns={["1.2fr", "0.03fr", "8fr"]}
        gap="size-100"
        margin={10}
      >
        <View gridArea="sidebar" overflow={"hidden"}>
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
                onAction={(key) => {
                  key === "sellFotos" && setOpenSellDialog(true);
                }}
              >
                <DialogTrigger>
                  <Item key="addTag">
                    <Label />
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
                  <Item key="addToClient">
                    <FolderUser />
                  </Item>
                  {(close) => (
                    <DialogAddToClient
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
                </Item>

                <DialogTrigger>
                  <Item key="deleteFotos">
                    <Delete />
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
              {openSellDialog && (
                <DialogContainer type="fullscreen">
                  <DialogSellFotos
                    close={() => setOpenSellDialog(false)}
                    selectedFotos={selectedFotos}
                    db={props.db}
                    postazioneId={postazioneId}
                    setSelectedFotos={(e) => setSelectedFotos(e)}
                    cartFotos={cartFotos}
                    setCartFotos={setCartFotos}
                  />
                </DialogContainer>
              )}
            </Flex>
            <Divider size="M" />
            <View overflow={"auto"} maxHeight={"50vh"} paddingBottom={50}>
              <Flex direction="column" gap="size-100">
                <Heading margin={0}>Filtra e Ricerca</Heading>
                <ClientFilter
                  db={props.db}
                  postazioneId={postazioneId}
                  filteredPhotos={filteredPhotos}
                  setFilteredPhotos={setFilteredPhotos}
                />
                <DataFilter />
                <TagsFilter
                  db={props.db}
                  postazioneId={postazioneId}
                  filteredPhotos={filteredPhotos}
                  setFilteredPhotos={setFilteredPhotos}
                  availableTags={availableTags}
                  setAvailableTags={setAvailableTags}
                />
                <LabelFilter
                  db={props.db}
                  postazioneId={postazioneId}
                  filteredPhotos={filteredPhotos}
                  setFilteredPhotos={setFilteredPhotos}
                />
              </Flex>
            </View>
          </Flex>
        </View>

        <Divider orientation="vertical" size="M" />

        <View gridArea="content" overflow={"auto"}>
          <Flex direction="column" gap="size-200" justifyContent={"center"}>
            <Flex gap="size-200" alignItems={"center"} justifyContent="start">
              {openEditDialog && (
                <DialogContainer type="fullscreen">
                  <DialogEditFoto
                    close={() => setOpenEditDialog(false)}
                    fotoToEdit={fotoToEdit}
                    db={props.db}
                    postazioneId={postazioneId}
                    setSelectedFotos={(e) => setFotoToEdit(e)}
                  />
                </DialogContainer>
              )}
              <Flex direction="column" gap="size-100">
                {/*<Flex gap="size-100" justifyContent="start">
                  <a>Home{">"} </a>
                  <span>{postazione && postazione.name}</span>
                </Flex>*/}
                <h2>{postazione && postazione.name}</h2>
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
                  <ImageAdd /> IMPORTA FOTO
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
                      <Switch onChange={setIsWebkitDirectory}>
                        Carica cartella
                      </Switch>
                      {isWebkitDirectory ? (
                        <input
                          type="file"
                          name="photos[]"
                          id="files"
                          multiple="multiple"
                          webkitdirectory="true"
                          accept="image/*"
                        />
                      ) : (
                        <input
                          type="file"
                          name="photos[]"
                          id="files"
                          multiple="multiple"
                          accept="image/*"
                        />
                      )}
                      <TabellaFotoInUpload
                        availableTags={availableTags}
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
                          uploadFotoFinal(filesToUpload, dispatch).then(
                            (data) => {
                              savePhotosToFirebase(
                                props.db,
                                filesToUpload,
                                postazioneId
                              ).then(() => {
                                close();
                              });
                            }
                          )
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
                  />
                </Item>
                <Item key="Impostazioni">
                  <PostazioneImpostazioni
                    db={props.db}
                    postazioneId={postazioneId}
                  />
                </Item>
                <Item key="Finanze">
                  <TabellaVenditePostazione vendite={vendite} />
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

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
  Header,
  Heading,
  Item,
  ProgressBar,
  Switch,
} from "@adobe/react-spectrum";

import { ToastQueue } from "@react-spectrum/toast";
import {
  getImagesFromFileInput,
  uploadFotoFinal,
} from "../../Functions/uploadFileToServer";
import TabellaFotoInUpload from "../../Organismi/TabellaFotoInUpload.js/TabellaFotoInUpload";
import {
  getTagsFromFirebase,
  savePhotosToFirebase,
} from "../../Functions/firebaseFunctions";

import {
  getSalesByPostazione,
  getTagsFromSettingsPostazione,
} from "../../Functions/firebaseGetFunctions";
import { StateContext } from "../../Context/stateContext";

function DialogUploadFoto(props) {
  const { state, dispatch } = useContext(StateContext);
  const { close, availableTags } = props;
  const [filesToUpload, setFilesToUpload] = useState({
    photos: [],
    tags: [],
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  let { postazioneId } = useParams();
  const [isWebkitDirectory, setIsWebkitDirectory] = useState(false);

  React.useEffect(() => {
    document.querySelector("#files").addEventListener("change", (event) => {
      getImagesFromFileInput("#files")
        .then((images) => {
          setFilesToUpload({photos: images });
        })
        .catch(function (error) {
          ToastQueue.negative(
            "Errore nel recuperare i file dall'input:" + error,
            {
              timeout: 2000,
            }
          );
        });
    });
  }, []);
  React.useEffect(() => {
    console.log(filesToUpload,selectedTags);
  }, [filesToUpload, selectedTags]);

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
      <Heading>Upload cartella Foto</Heading>
      <Header>Connection status: Connected</Header>
      <Divider />

      <Content>
        <Heading level={4}>
          Seleziona la cartella che vuoi caricare dal tuo computer.
        </Heading>
        <DialogContainer isDismissable={false}>
        {state.isUpload && (
          <Dialog>
            <Heading>Upload in corso</Heading>
            <Header>Perfavore Attendere</Header>
            <Divider />
            <Content>
              <ProgressBar
                label={state.statusUpload.label}
                minValue={0}
                maxValue={state.statusUpload.max}
                value={state.statusUpload.current}
                width={"100%"}
              />
            
            </Content>
          </Dialog>
        )}
      </DialogContainer>
        <Flex direction={"column"} gap={"size-200"}>
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
          <Flex gap="size-115">
            {" "}
            <Switch onChange={setIsWebkitDirectory}>Carica cartella</Switch>
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
          </Flex>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Chiudi
        </Button>
        <Button
          variant="accent"
          isDisabled={filesToUpload.photos.length === 0}
          onPress={() =>
            uploadFotoFinal(filesToUpload, dispatch).then((data) => {
              savePhotosToFirebase(props.db, filesToUpload, postazioneId,selectedTags).then(
                () => {
                  close();
                }
              );
            })
          }
        >
          Inizia Upload
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogUploadFoto;

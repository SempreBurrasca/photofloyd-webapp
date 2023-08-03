import React, { useState, useEffect } from "react";

import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
  View,
} from "@adobe/react-spectrum";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";
import PhotofloydCanvas from "../../Organismi/PhotofloydCanvas/PhotofloydCanvas";
import SelectedFotosCarousel from "../../Organismi/PhotofloydCanvas/SelectedFotosCarousel";
import Crop from "@spectrum-icons/workflow/Crop";
import c_o from "../../asset/cornici/cornice_oriz.png";
import c_v from "../../asset/cornici/cornice_vert.png";
import c_vt from "../../asset/cornici/corniceTest_vert.png";
import watermark from "../../asset/logo-photofloyd.png";
import { makeId } from "../../Functions/logicArray";
import { updatePhotoURL } from "../../Functions/firebasePhotosFunctions";
function DialogEditFotoFR(props) {
  const { close, fotoToEdit, db, postazioneId, selectedFotos } = props;
  const [activeFoto, setActiveFoto] = useState(selectedFotos[0]);
  const [update, setUpdate] = useState(0);
  const [filter, setFilter] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isImgEditorShown, setIsImgEditorShown] = useState(false);
  const [saveNow, setSaveNow] = useState(false);
  const [isCornice, setIsCornice] = useState(false);
  const [cornice, setCornice] = useState(false);

  useEffect(() => {}, [activeFoto]);

  const openImgEditor = () => {
    // cambiato qui
    setIsImgEditorShown(true);
  };

  const closeImgEditor = () => {
    setIsImgEditorShown(false);
  };

  function base64toBlob(base64Data, contentType) {
    contentType = contentType || "";
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const onSave = async (editedImageObject, designState) => {
    const { imageBase64 } = editedImageObject;

    // estrai i dati immagine da imageBase64
    const imageType = imageBase64.match(/data:(.*);base64,/)[1];
    const imageBase64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Genera un ID casuale
    const randomId = makeId(4);

    // Crea un Blob dal base64 dell'immagine
    console.log("Creating Blob from Base64 image");
    const imageBlob = base64toBlob(imageBase64Data, imageType);

    // Crea un oggetto FormData
    console.log("Creating FormData object");
    const formData = new FormData();
    formData.append(
      "photos",
      imageBlob,
      `${editedImageObject.name}-modificata-${randomId}.${editedImageObject.extension}`
    );

    const baseURL = process.env.PUBLIC_URL;
    const url = `${baseURL}/upload3.php`;

    console.log("Base URL: ", baseURL);
    console.log("Full URL: ", url);

    // Invia i dati al server
    console.log("Sending data to server");
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      // Stampa la risposta del server
      console.log("Response from server: ", response);

      // Prova a convertire la risposta in testo e poi in JSON
      const responseText = await response.text();
      console.log("Response text from server: ", responseText);

      const jsonResponse = JSON.parse(responseText);
      console.log("JSON response from server: ", jsonResponse);
      if (jsonResponse.success && jsonResponse.photos) {
        jsonResponse.photos.forEach(async (photo) => {
          await updatePhotoURL(postazioneId, activeFoto.id, photo.url);
        });
      }
    } catch (error) {
      console.error("There was an error with the request: ", error);
    }
  };

  return (
    <Dialog size="L" type="fullscreen">
      <Heading>Editing Foto</Heading>
      <Divider />
      <Content>
        {isImgEditorShown && ( // cambiato qui
          <FilerobotImageEditor
            source={activeFoto.data.url}
            onSave={onSave}
            onClose={closeImgEditor}
            annotationsCommon={{
              fill: undefined,
            }}
            Image={{
              disableUpload: true,
              gallery: [
                { originalUrl: watermark, previewUrl: watermark },
                { originalUrl: c_o, previewUrl: c_o },
                { originalUrl: c_v, previewUrl: c_v },
                { originalUrl: c_vt, previewUrl: c_vt },
              ],
            }}
            Text={{ text: "Filerobot..." }}
            Rotate={{ angle: 90, componentType: "slider" }}
            Crop={{}}
            tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]} // or {['Adjust', 'Annotate', 'Watermark']}
            defaultTabId={TABS.ANNOTATE} // or 'Annotate'
            defaultToolId={TOOLS.IMAGE} // or 'Text'
            Watermark={{
              gallery: [watermark],
              position: "center", // Can be: 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
              opacity: 1, // Opacity of the watermark image
              applyByDefault: true, // If true, the watermark will be applied to the image by default
            }}
          />
        )}
        {!isImgEditorShown && (
          <Text>Seleziona la foto da modificare e clicca su Edit</Text>
        )}
        {!isImgEditorShown && (
          <Flex gap={"size-115"} wrap={true}>
            {selectedFotos.map((foto) => (
              <View
                padding={10}
                backgroundColor={activeFoto.id === foto.id && "yellow-500"}
              >
                <img
                  src={foto.data.url}
                  style={{ width: 200, height: "auto", cursor: "pointer" }}
                  onClick={() => setActiveFoto(foto)}
                />
              </View>
            ))}
          </Flex>
        )}
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Indietro
        </Button>
        <Button variant="secondary" onPress={openImgEditor}>
          Edit
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogEditFotoFR;

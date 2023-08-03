import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Flex,
  Heading,
  TextArea,
  TextField,
  Well,
  ProgressCircle,
  Text,
} from "@adobe/react-spectrum";
import { applyWatermark, dataURLToBlob } from "../../Functions/tools";
import watermark from "../../asset/logo-photofloyd.png";
import { makeId } from "../../Functions/logicArray";
import Compressor from "compressorjs";
import { saveWatermarkedPhotosToFirebase } from "../../Functions/firebaseFunctions";

function DialogWatermark(props) {
  const { close, selectedFotos } = props;
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [password, setPassword] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); // 'idle' | 'uploading' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleConfirm = async () => {
    setUploadStatus('uploading');
    setStatusMessage("Inizio del processo di applicazione del watermark...");
    const watermarkedImages = [];
    let count = 0;
  
    for (let foto of selectedFotos) {
      try {
        const watermarkedDataURL = await applyWatermark(foto.data.url, watermark);
        const blob = dataURLToBlob(watermarkedDataURL);
        watermarkedImages.push({blob, id: foto.id, originalUrl: foto.data.url});
        count++;
        setUploadProgress(Math.round((count / selectedFotos.length) * 100));
        setStatusMessage(`Applicazione del watermark in corso... ${uploadProgress}%`);
      } catch (error) {
        console.error(error);
        setUploadStatus('error');
        setStatusMessage("Si è verificato un errore durante l'applicazione del watermark.");
        return; // If you want to stop the whole process when an error occurs
      }
    }
  
    setStatusMessage("Inizio del processo di caricamento...");
  
    for (let image of watermarkedImages) {
      try {
        const formData = new FormData();
    
        formData.append("photo", image.blob, image.id + "-" + makeId(4) + "-" + "watermarked.jpg");
    
        const baseURL = process.env.PUBLIC_URL; // Replace with your server URL
    
        const url = `${baseURL}/upload2.php?subfolder=${nome}`;
    
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.photos && responseData.photos.length > 0) {
            image.uploadedUrl = responseData.photos[0].url;
            console.log(`Upload success, URL: ${responseData.photos[0].url}`);
            setStatusMessage(`Caricamento immagine ${image.id} completato.`);
          } else {
            throw new Error("Upload error: no photos returned");
          }
        } else {
          throw new Error("Upload error");
        }
      } catch (error) {
        console.error(error);
        setUploadStatus('error');
        setStatusMessage(`Si è verificato un errore durante il caricamento dell'immagine ${image.id}.`);
        return; // If you want to stop the whole process when an error occurs
      }
    }

    // After uploading the images, save them to Firestore
    try {
      await saveWatermarkedPhotosToFirebase(watermarkedImages, nome, descrizione, password);
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      setStatusMessage("Si è verificato un errore durante il salvataggio delle foto su Firebase.");
      return;
    }

    setUploadStatus('success');
    setStatusMessage("Tutte le immagini sono state caricate con successo.");

    console.log(watermarkedImages); // This will print the array of objects containing the original and the uploaded image URLs
    close()
  };


  return (
    <Dialog>
      <Heading>
        Crea una collezione di foto da condividere con Watermark
      </Heading>
      <Divider />
      <Content>
        <Flex direction={"column"} gap={"size-115"} width={"100%"}>
          <Well>
            Stai per creare una collezione protetta da password con{" "}
            {selectedFotos.length} foto. Compila i campi sottostanti per
            proseguire.
          </Well>
          <TextField
            label="Nome"
            isRequired
            type="text"
            width={"100%"}
            value={nome}
            onChange={setNome}
          ></TextField>
          <TextArea
            label="Descrizione"
            isRequired
            type="text"
            width={"100%"}
            value={descrizione}
            onChange={setDescrizione}
          ></TextArea>
          <TextField
            label="Password"
            isRequired
            type="text"
            width={"100%"}
            value={password}
            onChange={setPassword}
          ></TextField>
          {uploadStatus === "uploading" && (
            <>
              <ProgressCircle
                aria-label="Loading…"
                isIndeterminate
                isHidden={uploadStatus !== "uploading"}
                marginStart="auto"
                marginEnd="auto"
                marginTop="size-400"
              />
              <Text>{statusMessage}</Text>
            </>
          )}
          {uploadStatus === "success" && <Text>{statusMessage}</Text>}
          {uploadStatus === "error" && <Text>{statusMessage}</Text>}
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Annulla
        </Button>
        <Button
          variant="accent"
          isDisabled={
            password === "" || nome === "" || descrizione === "" ? true : false
          }
          onPress={handleConfirm}
        >
          Conferma
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogWatermark;

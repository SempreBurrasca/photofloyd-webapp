import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Heading,
  Image,
  Item,
  ListView,
  Text,
  useAsyncList,
} from "@adobe/react-spectrum";
import {
  getImagesFromIndexedDB,
  loadImagesFromIndexedDB,
} from "../../Functions/IndexedDB";
import ListaFoto from "./ListaFoto";

function TabellaFotoInUpload(props) {
  return (
    <Flex direction={"column"} gap={"size-100"}>
      <Heading level={4}>
        Se vuoi aggiungere le foto in una cartella specifica o taggarle selezionale,
        altrimenti verranno aggiunte nella cartella principale così come sono.
      </Heading>
      <ListaFoto callSetFilesToUpload={props.callSetFilesToUpload}/>
    </Flex>
  );
}

export default TabellaFotoInUpload;

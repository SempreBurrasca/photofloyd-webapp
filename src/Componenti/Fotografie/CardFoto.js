import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  ActionButton,
  ActionGroup,
  Button,
  Checkbox,
  Flex,
  Heading,
  Image,
  Item,
  Text,
  View,
} from "@adobe/react-spectrum";

import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { ToastQueue } from "@react-spectrum/toast";
import Checkmark from "@spectrum-icons/workflow/Checkmark";
import Help from "@spectrum-icons/workflow/Help";

import Cancel from "@spectrum-icons/workflow/Cancel";
import { updatePhotoLabel } from "../../Functions/firebaseFunctions";

function CardFoto(props) {
  let foto = props.foto;
  const handleSelectFoto = props.handleSelectFoto;
  let selectedFotografie = props.selectedFotografie;

  return (
    <View
      key={foto.id}
      width="250px"
      borderRadius="medium"
      backgroundColor={
        selectedFotografie.includes(foto) ? "blue-400" : "static-white"
      }
    >
      <Image
        src={foto.data.url}
        alt="dsadasdas"
        objectFit="cover"
        width="100%"
        height="100%"
      />
      <Flex direction={"column"} gap={"size-100"} margin={"size-200"}>
        <Flex direction="row" gap={"size-100"} alignItems={"center"}>
          <Checkbox
            aria-label="fdsaf"
            isSelected={ selectedFotografie.includes(foto) ? true: false}
            onChange={() => handleSelectFoto(foto)}
          />
          <Flex direction="column" justifyContent={"center"}>
            <Text level={5}>{foto.data.name}</Text>
            <Text>{foto.data.fotografo.nome}</Text>
          </Flex>
        </Flex>

        <Flex
          flex={1}
          direction="row"
          gap="size-100"
          justifyContent={"space-between"}
        >
          <ActionGroup
            density="compact"
            isEmphasized
            selectionMode="single"
            defaultSelectedKeys={[foto.data.label]}
            onAction={(key) => {
              key===foto.data.label?
              updatePhotoLabel(props.db, foto.data, " ", props.postazioneId)
              :
              updatePhotoLabel(props.db, foto.data, key, props.postazioneId)
            }}
          >
            <Item key="Check" aria-label="Check">
              <Checkmark />
            </Item>
            <Item key="Help" aria-label="Help">
              <Help />
            </Item>
            <Item key="Cancel" aria-label="Cancel">
              <Cancel />
            </Item>
          </ActionGroup>

          <Button variant="accent">Modifica</Button>
        </Flex>
      </Flex>
    </View>
  );
}

export default CardFoto;

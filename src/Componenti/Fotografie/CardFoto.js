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
import { getEdits } from "../../Functions/firebaseGetFunctions";
import ArrowLeft from "@spectrum-icons/workflow/ArrowLeft";
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";

function CardFoto(props) {
  const {
    foto,
    handleSelectFoto,
    selectedFotografie,
    display,
    fotoToEdit,
    setFotoToEdit,
    setOpenEditDialog,
  } = props;
  const [edits, setEdits] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState();
  const [editCursor, setEditCursor] = useState(0);
  useEffect(() => {
    getEdits(props.postazioneId, foto.id).then((_edits) => {
      setEdits([{ id: "original", name: "Originale" }, ..._edits]);
    });
  }, [display]);

  const handleNextEdit = () => {
    if (editCursor < edits.length - 1) {
      setEditCursor(editCursor + 1);
    } else {
      setEditCursor(0);
    }
  };
  const handlePrevEdit = () => {
    if (editCursor > 0) {
      setEditCursor(editCursor - 1);
    } else {
      setEditCursor(edits.length - 1);
    }
  };
  const handleImageUrl = () => {
    if (edits.length > 0) {
      if (edits[editCursor].id === "original") {
        return foto.data.url;
      } else {
        return edits[editCursor].url;
      }
    } else {
      return foto.data.url;
    }
  };
  const handleImageName = () => {
    if (edits.length > 0) {
      if (edits[editCursor].id === "original") {
        return foto.data.name;
      } else {
        console.log(edits[editCursor]);
        return edits[editCursor].name;
      }
    } else {
      return foto.data.name;
    }
  };
  if (display) {
    return (
      <View
        key={foto.id}
        width="250px"
        borderRadius="medium"
        backgroundColor={
          selectedFotografie.includes(foto) ? "blue-400" : "static-white"
        }
        position={"relative"}
      >
        <Image
          src={handleImageUrl()}
          alt="dsadasdas"
          objectFit="cover"
          width="100%"
          height="100%"
        />
        <View position={"absolute"} top="10px" left={"10px"}>
          <Checkbox
            aria-label="fdsaf"
            isSelected={selectedFotografie.includes(foto) ? true : false}
            onChange={() => handleSelectFoto(foto)}
          />
        </View>
        <Flex direction={"column"} gap={"size-100"} margin={"size-200"}>
          <Flex direction="row" gap={"size-100"} alignItems={"center"}>
            <Flex
              direction="column"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <ActionGroup
                density="compact"
                isEmphasized
                selectionMode="single"
                orientation="vertical"
                defaultSelectedKeys={[foto.data.label]}
                onAction={(key) => {
                  key === foto.data.label
                    ? updatePhotoLabel(
                        props.db,
                        foto.data,
                        " ",
                        props.postazioneId
                      )
                    : updatePhotoLabel(
                        props.db,
                        foto.data,
                        key,
                        props.postazioneId
                      );
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
            </Flex>
            <Flex direction="column" justifyContent={"center"}>
              <h3 className="title-card-foto">{foto.data.name}</h3>
              <span className="fotografo-card-foto">{foto.data.fotografo.nome}</span>
              {edits.length > 0 && edits[1] && (
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <ActionButton isQuiet onPress={handlePrevEdit}>
                    <ArrowLeft />
                  </ActionButton>
                  <span className="edit-name-in-card">
                    {editCursor.id !== "original"
                      ? edits[editCursor].name
                      : "Originale"}
                  </span>
                  <ActionButton isQuiet onPress={handleNextEdit}>
                    <ArrowRight />
                  </ActionButton>
                </Flex>
              )}
            </Flex>
          </Flex>

          <Flex
            flex={1}
            direction="row"
            gap="size-100"
            justifyContent={"center"}
            margin={"10px"}
          >
            <Button
              variant="accent"
              width={"100%"}
              onPress={() => {
                setFotoToEdit(foto);
                setOpenEditDialog(true);
              }}
            >
              Modifica
            </Button>
          </Flex>
        </Flex>
      </View>
    );
  } else {
    return;
  }
}

export default CardFoto;

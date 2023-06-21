import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import {
  ActionGroup,
  DialogContainer,
  DialogTrigger,
  Flex,
  Item,
  Text,
  Well,
} from "@adobe/react-spectrum";
import Label from "@spectrum-icons/workflow/Label";
import Shop from "@spectrum-icons/workflow/Shop";
import Delete from "@spectrum-icons/workflow/Delete";

import DialogAddTag from "../DialogAddTag";
import DialogDeleteFotos from "../DialogDeleteFotos";

import DialogSellFotos from "../DialogSellFotos";
import DialogAddToClient from "../DialogAddToClient";
import FolderUser from "@spectrum-icons/workflow/FolderUser";

import { StateContext } from "../../../Context/stateContext";

import EditIn from "@spectrum-icons/workflow/EditIn";

function SidebarActions(props) {
  const { state, dispatch } = useContext(StateContext);
  let { postazioneId } = useParams();
  const {
    selectedFotos,
    setOpenSellDialog,
    setIsEditMode,
    db,
    setSelectedFotos,
    availableTags,
    openSellDialog,
    cartFotos,
    setCartFotos,
  } = props;

  return (
    <Flex direction="column" gap="size-100">
      {selectedFotos.length > 0 ? (
        <Well>
          <Text>
            {selectedFotos.length} foto selezionate.
            <br />
            Utilizza i tasti qui sotto per compiere operazioni su queste foto.
          </Text>
        </Well>
      ) : (
        <Text>Seleziona una o più foto per operare azioni multiple.</Text>
      )}

      <ActionGroup
        orientation="vertical"
        isJustified
        density="compact"
        isDisabled={selectedFotos.length === 0}
        onAction={(key) => {
          if (key === "sellFotos") {
            setOpenSellDialog(true);
          } else if ((key = "editFoto")) {
            setIsEditMode(true);
          }
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
              db={db}
              postazioneId={postazioneId}
              setSelectedFotos={(e) => setSelectedFotos(e)}
              availableTags={availableTags}
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
              db={db}
              postazioneId={postazioneId}
              setSelectedFotos={(e) => setSelectedFotos(e)}
            />
          )}
        </DialogTrigger>

        <Item key="sellFotos">
          <Shop />
        </Item>
        <Item key="editFoto">
          <EditIn />
        </Item>
        <DialogTrigger>
          <Item key="deleteFotos">
            <Delete />
          </Item>
          {(close) => (
            <DialogDeleteFotos
              close={close}
              selectedFotos={selectedFotos}
              db={db}
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
            db={db}
            postazioneId={postazioneId}
            setSelectedFotos={(e) => setSelectedFotos(e)}
            cartFotos={cartFotos}
            setCartFotos={setCartFotos}
          />
        </DialogContainer>
      )}
    </Flex>
  );
}

export default SidebarActions;

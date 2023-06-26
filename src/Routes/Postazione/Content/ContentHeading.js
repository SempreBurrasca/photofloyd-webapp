import React, { useState, useEffect, useContext } from "react";

import {
  ActionButton,

  DialogContainer,
  DialogTrigger,
  
  Flex,

} from "@adobe/react-spectrum";

import ImageAdd from "@spectrum-icons/workflow/ImageAdd";

import DialogEditFoto from "../DialogEditFoto";

import { StateContext } from "../../../Context/stateContext";

import DialogUploadFoto from "../../../Organismi/Dialogs/DialogUploadFoto";


function ContentHeading(props) {
  const { state, dispatch } = useContext(StateContext);
  const {
    openEditDialog,
    setOpenEditDialog,
    fotoToEdit,
    db,
    postazioneId,
    setFotoToEdit,
    postazione,
    availableTags,
  } = props;

  return (
    <Flex gap="size-200" alignItems={"center"} justifyContent="start">
      <Flex direction="column" gap="size-100">
        {/*<Flex gap="size-100" justifyContent="start">
                  <a>Home{">"} </a>
                  <span>{postazione && postazione.name}</span>
                </Flex>*/}
        <h2>{postazione && postazione.name}</h2>
        <span>
          {state.currentPostazione &&
            state.currentPostazione.uploadCounter &&
            "Upload effettuati: " + state.currentPostazione.uploadCounter}
        </span>
        {/*postazione && (
                  <TagGroup items={postazione.tag} aria-label="Tag ">
                    {(item, index) => (
                      <Item key={item.id + "-" + makeId(3)}>{item.name}</Item>
                    )}
                  </TagGroup>
                    )*/}
      </Flex>
      <DialogTrigger>
        <ActionButton>
          <ImageAdd /> IMPORTA FOTO
        </ActionButton>
        {(close) => (
          <DialogUploadFoto
            close={close}
            availableTags={availableTags}
            db={db}
          />
        )}
      </DialogTrigger>
    </Flex>
  );
}

export default ContentHeading;

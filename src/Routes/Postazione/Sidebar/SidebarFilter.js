import React, { useState, useEffect, useContext } from "react";

import { useParams } from "react-router-dom";

import { ActionButton, Divider, Flex, Heading } from "@adobe/react-spectrum";

import LabelFilter from "../../../Organismi/Sidebar/LabelFilter";

import ClientFilter from "../../../Organismi/Sidebar/ClientFilter";

import { StateContext } from "../../../Context/stateContext";
import TagsFilter from "../../../Organismi/Sidebar/TagsFilter";
import DataFilter from "../../../Organismi/Sidebar/DataFilter";

import FotografoFilter from "../../../Organismi/Sidebar/FotografoFilter";

function SidebarFilter(props) {
  const { state, dispatch } = useContext(StateContext);
  let { postazioneId } = useParams();
  const {
    db,
    filteredPhotos,
    setFilteredPhotos,
    availableTags,
    setAvailableTags,
  } = props;

  const resetFilter = () => {
    dispatch({
      type: "SET_FILTER_TAGS",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_CLIENT",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_LABEL",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_DATA",
      tags: false,
    });
    dispatch({
      type: "SET_FILTER_FOTOGRAFO",
      tags: false,
    });
  };

  return (
    <Flex direction="column" gap="size-100">
      <Heading margin={0}>Filtra e Ricerca</Heading>
      <ClientFilter
        db={db}
        postazioneId={postazioneId}
        filteredPhotos={filteredPhotos}
        setFilteredPhotos={setFilteredPhotos}
      />
      <FotografoFilter db={db} postazioneId={postazioneId} />
      <DataFilter />
      <TagsFilter
        db={db}
        postazioneId={postazioneId}
        filteredPhotos={filteredPhotos}
        setFilteredPhotos={setFilteredPhotos}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
      />
      <LabelFilter
        db={db}
        postazioneId={postazioneId}
        filteredPhotos={filteredPhotos}
        setFilteredPhotos={setFilteredPhotos}
      />
      <Divider size="S"/>
      <ActionButton
        onPress={() => {
          resetFilter();
          console.log("reset");
        }}
      >
        Resetta filtri
      </ActionButton>
    </Flex>
  );
}

export default SidebarFilter;

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
  const [reset, setReset] = useState(0);
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
        reset={reset}
      />
      <FotografoFilter db={db} postazioneId={postazioneId}    reset={reset}/>
      <DataFilter    reset={reset}/>
      <TagsFilter
        db={db}
        postazioneId={postazioneId}
        filteredPhotos={filteredPhotos}
        setFilteredPhotos={setFilteredPhotos}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
        reset={reset}
      />
      <LabelFilter
        db={db}
        postazioneId={postazioneId}
        filteredPhotos={filteredPhotos}
        setFilteredPhotos={setFilteredPhotos}
        reset={reset}
      />
      <Divider size="S" />
      <ActionButton
        onPress={() => {
          resetFilter();
          setReset(reset + 1);
        }}
      >
        Resetta filtri
      </ActionButton>
    </Flex>
  );
}

export default SidebarFilter;

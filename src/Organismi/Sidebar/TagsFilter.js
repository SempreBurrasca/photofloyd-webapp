import React, { useState, useEffect, useContext } from "react";
import { Flex, Heading, Item, ActionGroup } from "@adobe/react-spectrum";

import { TagGroup } from "@react-spectrum/tag";
import { makeId } from "../../Functions/logicArray";
import { StateContext } from "../../Context/stateContext";

function TagsFilter(props) {
  const { state, dispatch } = useContext(StateContext);
  const {
    db,
    postazioneId,
    filteredPhotos,
    setFilteredPhotos,
    availableTags,
    setAvailableTags,
  } = props;
  const [selectedTags, setSelectedTags] = React.useState([]);

  useEffect(() => {
    if (selectedTags.length > 0) {
      dispatch({
        type: "SET_FILTER_TAGS",
        tags: selectedTags,
      });
    } else {
      dispatch({
        type: "SET_FILTER_TAGS",
        tags: false,
      });
    }
  }, [selectedTags]);

  const handleSelection = (e) => {
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
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5} margin={0}>
        Filtra per tag
      </Heading>
      <ActionGroup
        items={availableTags}
        aria-label="Tag di filtraggio"
        selectionMode="multiple"
        isEmphasized
        onAction={(e) => {
          handleSelection(e);
        }}
      >
        {(item) => (
          <Item key={item.name} onClick={() => console.log("das")}>
            {item.name}
          </Item>
        )}
      </ActionGroup>
    </Flex>
  );
}

export default TagsFilter;

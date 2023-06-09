import React, { useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import { ActionGroup, Flex, Heading, Item } from "@adobe/react-spectrum";

import { getCartelle, getPhotoNames } from "../../Functions/firebaseFunctions";
import Checkmark from "@spectrum-icons/workflow/Checkmark";
import Help from "@spectrum-icons/workflow/Help";
import Cancel from "@spectrum-icons/workflow/Cancel";
import { StateContext } from "../../Context/stateContext";

function LabelFilter(props) {
  const { state, dispatch } = useContext(StateContext);
  let [selected, setSelected] = React.useState([]);
  let [folders, setFolders] = useState([]);
  useEffect(() => {
    if (selected.length > 0) {
      dispatch({
        type: "SET_FILTER_LABEL",
        label: selected,
      });
      console.log(selected)
    } else {
      dispatch({
        type: "SET_FILTER_LABEL",
        label: false,
      });
    }
  }, [selected]);

  const handleSelection = (e) => {
    let array = selected;
    if (array.includes(e)) {
      const index = array.indexOf(e);
      if (index > -1) {
        // only splice array when item is found
        array.splice(index, 1); // 2nd parameter means remove one item only
        setSelected([...array]);
      }
    } else {
      setSelected([...array, e]);
    }
  };
  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5} margin={0}>
        Filtra per segno
      </Heading>
      <ActionGroup
        density="compact"
        isEmphasized
        selectionMode="multiple"
        onAction={handleSelection}
      >
        <Item key="Check" aria-label="Check">
          <Checkmark color="positive" />
        </Item>
        <Item key="Help" aria-label="Help" color="notice">
          <Help />
        </Item>
        <Item key="Cancel" aria-label="Cancel" color="negative">
          <Cancel />
        </Item>
      </ActionGroup>
    </Flex>
  );
}

export default LabelFilter;

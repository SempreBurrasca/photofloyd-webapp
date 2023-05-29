import React, { useEffect } from "react";
import {
  ActionButton,
  Divider,
  Flex,
  Heading,
  NumberField,
  Text,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import {
  getTagsFromFirebase,
  saveProductToFirebase,
  saveTagsToFirebase,
} from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import SaveAsFloppy from "@spectrum-icons/workflow/SaveAsFloppy";
import SingleFormProduct from "./SingleFormProduct";
import SingleFormTax from "./SingleFormTax";

function TaxAddForm(props) {
  const { taxes } = props;
  return (
    <View
      overflow={"auto"}
      maxHeight={"40vh"}
      padding={"size-350"}
      width={"100%"}
    >
      {taxes.map((tax, index) => (
        <SingleFormTax
          key={tax.id}
          tax={tax}
          db={props.db}
        />
      ))}
    </View>
  );
}

export default TaxAddForm;

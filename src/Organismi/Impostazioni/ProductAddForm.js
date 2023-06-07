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

function ProductAddForm(props) {
  const { prodotti } = props;
  return (
    <View
      overflow={"auto"}
      maxHeight={"40vh"}
      padding={"size-350"}
      width={"100%"}
    >
      <Flex direction={"column"} gap={"size-500"}>
        {prodotti.map((prodotto, index) => (
          <SingleFormProduct
            key={prodotto.id}
            prodotto={prodotto}
            db={props.db}
          />
        ))}
      </Flex>
    </View>
  );
}

export default ProductAddForm;

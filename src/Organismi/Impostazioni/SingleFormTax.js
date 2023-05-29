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
  saveTagsPostazioneToFirebase,
  saveTagsToFirebase,
  saveTaxToFirebase,
} from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import SaveAsFloppy from "@spectrum-icons/workflow/SaveAsFloppy";

function SingleFormTax(props) {
  const { taxes } = props;
  const [tax, setTax] = React.useState(props.tax);
  return (
    <Flex
      direction={"row"}
      gap={"size-100"}
      alignItems={"end"}
      width={"100%"}
      justifyContent={"space-between"}
    >
      <TextField
        label="Nome"
        width={"100%"}
        value={tax.nome}
        onChange={(e) => setTax({ ...tax, nome: e })}
      />
      <NumberField
        label="Prezzo"
        width={"100%"}
        value={tax.prezzo}
        formatOptions={{
          style: "percent",
        }}
        onChange={(e) => setTax({ ...tax, prezzo: e })}
      />
      <ActionButton
        onPress={() => {
          saveTaxToFirebase(props.db, tax);
        }}
      >
        <SaveAsFloppy />
      </ActionButton>
    </Flex>
  );
}

export default SingleFormTax;

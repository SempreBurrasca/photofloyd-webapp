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
  saveValutaToFirebase,
} from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import SaveAsFloppy from "@spectrum-icons/workflow/SaveAsFloppy";

function SingleFormValuta(props) {
  const { valute } = props;
  const [valuta, setValuta] = React.useState(props.valuta);
  return (
    <Flex
      direction={"row"}
      gap={"size-100"}
      alignItems={"end"}
      width={"100%"}
      justifyContent={"space-between"}
    >
      <TextField
        label="Symbol"
        width={"100%"}
        value={valuta.symbol}
        onChange={(e) => setValuta({ ...valuta, symbol: e })}
      />
      <NumberField
        label="Cambio"
        width={"100%"}
        value={valuta.cambio}
        formatOptions={{
          style: "percent",
        }}
        onChange={(e) => setValuta({ ...valuta, cambio: e })}
      />
      <ActionButton
        onPress={() => {
          saveValutaToFirebase(valuta);
        }}
      >
        <SaveAsFloppy />
      </ActionButton>
    </Flex>
  );
}

export default SingleFormValuta;

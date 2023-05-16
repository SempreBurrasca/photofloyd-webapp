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

function SingleFormProduct(props) {
  const { prodotti } = props;
  const [prodotto, setProdotto] = React.useState(props.prodotto);
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
        value={prodotto.nome}
        onChange={(e) => setProdotto({ ...prodotto, nome: e })}
      />
      <TextField
        label="Descrizione"
        width={"100%"}
        value={prodotto.descrizione}
        onChange={(e) => setProdotto({ ...prodotto, descrizione: e })}
      />
      <NumberField
        label="Prezzo"
        width={"100%"}
        value={prodotto.prezzo}
        formatOptions={{
          style: "currency",
          currency: "EUR",
          currencyDisplay: "code",
          currencySign: "accounting",
        }}
        onChange={(e) => setProdotto({ ...prodotto, prezzo: e })}
      />
      <ActionButton
        onPress={() => {
          saveProductToFirebase(props.db, prodotto);
        }}
      >
        <SaveAsFloppy />
      </ActionButton>
    </Flex>
  );
}

export default SingleFormProduct;

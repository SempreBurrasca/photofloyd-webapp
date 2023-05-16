import React, { useEffect } from "react";
import {
  ActionButton,
  Divider,
  Flex,
  Heading,
  Text,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import {
  getProductsFromFirebase,
  getTagsFromFirebase,
  saveTagsToFirebase,
} from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import SaveAsFloppy from "@spectrum-icons/workflow/SaveAsFloppy";
import ProductAddForm from "../../Organismi/Impostazioni/ProductAddForm";

function DashboardImpostazioni(props) {
  let [tags, setTags] = React.useState("");
  const [prodotti, setProdotti] = React.useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getTagsFromFirebase(props.db).then((tags) => {
      let arr = [];
      tags.map((tag) => {
        arr.push(tag.name);
      });
      setTags(arr.join(","));
    });
    getProductsFromFirebase(props.db).then((prodotti) => {
      setProdotti(prodotti);
    });
  }, []);
  const addOneProductPlaceholder = () => {
    const newProduct = {
      id: makeId(8),
      nome: "",
      prezzo: "",
      descrizione: "",
    };
    setProdotti((prevProdotti) => [...prevProdotti, newProduct]);
  };
  return (
    <Flex
      direction={"column"}
      minHeight="100vh"
      alignItems={"center"}
      gap="size-130"
    >
      <Heading level={1}>Impostazioni</Heading>
      <Text>Qui puoi personalizzare le impostazioni dell'applicazione.</Text>
      <Divider size="M" />
      <Flex direction={"column"} width={"70%"} gap={"size-325"}>
        <Flex direction={"column"} gap={"size-100"}>
          <Text>
            Inserisci i tag che vuoi che siano disponibili nella scelta delle
            cartelle separati dalla ,
          </Text>
          <TextField
            label="Tag delle cartelle."
            width={"100%"}
            onChange={setTags}
            value={tags}
          />
          <ActionButton
            onPress={() => {
              saveTagsToFirebase(props.db, tags);
            }}
          >
            Salva Tags
          </ActionButton>
        </Flex>
        <Divider size="S" />
        <Flex direction={"column"} gap={"size-125"} alignItems={"center"}>
          <Text>
            Inserisci i prodotti che vuoi siano disponibili per tutte le
            postazioni di vendita.
          </Text>
          <ProductAddForm prodotti={prodotti} db={props.db} />
          <ActionButton onPress={addOneProductPlaceholder}>
            Aggiungi Prodotto
          </ActionButton>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DashboardImpostazioni;

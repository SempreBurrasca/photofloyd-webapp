import React, { useContext, useEffect } from "react";
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
  saveTagsPostazioneToFirebase,
  saveTagsToFirebase,
} from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import SaveAsFloppy from "@spectrum-icons/workflow/SaveAsFloppy";
import ProductAddForm from "../../Organismi/Impostazioni/ProductAddForm";
import { getTagsPostazioneFromFirebase } from "../../Functions/firebaseGetFunctions";
import TaxAddForm from "../../Organismi/Impostazioni/TaxAddForm";
import { StateContext } from "../../Context/stateContext";

function DashboardImpostazioni(props) {
  let [tags, setTags] = React.useState("");
  let [tagsP, setTagsP] = React.useState("");
  const { state, dispatch } = useContext(StateContext);
  const [prodotti, setProdotti] = React.useState([]);
  const [taxes, setTaxes] = React.useState(state.taxes&&state.taxes);

  useEffect(() => {
    getTagsFromFirebase(props.db).then((tags) => {
      let arr = [];
      tags.map((tag) => {
        arr.push(tag.name);
      });
      setTags(arr.join(","));
    });
    getTagsPostazioneFromFirebase(props.db).then((tags) => {
      let arr = [];
      tags.map((tag) => {
        arr.push(tag.name);
      });
      setTagsP(arr.join(","));
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
  const addOneTaxPlaceholder = () => {
    const newTax = {
      id: makeId(8),
      nome: "",
      prezzo: "",
    };
    setTaxes((prevTaxes) => [...prevTaxes, newTax]);
  };
  return (
    <View padding={10} paddingBottom={50} backgroundColor="gray-200">
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
          <Heading level={2}>Tags</Heading>
            <Text>
              Inserisci i tag che vuoi che siano disponibili nella creazione
              delle postazioni separati dalla ,
            </Text>
            <TextField
              label="Tag delle postazioni."
              width={"100%"}
              onChange={setTagsP}
              value={tagsP}
            />
            <ActionButton
              onPress={() => {
                saveTagsPostazioneToFirebase(props.db, tags);
              }}
            >
              Salva Tags
            </ActionButton>
          </Flex>
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
          <Heading level={2}>Prodotti</Heading>
            <Text>
              Inserisci i prodotti che vuoi siano disponibili per tutte le
              postazioni di vendita.
            </Text>
            <ProductAddForm prodotti={prodotti} db={props.db} />
            <ActionButton onPress={addOneProductPlaceholder}>
              Aggiungi Prodotto
            </ActionButton>
          </Flex>
          <Divider size="S" />
          <Flex direction={"column"} gap={"size-125"} alignItems={"center"}>
          <Heading level={2}>Tasse</Heading>
            <Text>
              Inserisci le tasse che vuoi aggiungere agli ordini nelle tue
              postazioni di vendita.
            </Text>
            {taxes&&<TaxAddForm taxes={taxes} db={props.db} />}
            <ActionButton onPress={addOneTaxPlaceholder}>
              Aggiungi Tassa
            </ActionButton>
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
}

export default DashboardImpostazioni;

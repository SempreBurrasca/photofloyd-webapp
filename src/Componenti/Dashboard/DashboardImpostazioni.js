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
import { getTagsPostazioneFromFirebase, getValuteDocuments } from "../../Functions/firebaseGetFunctions";
import TaxAddForm from "../../Organismi/Impostazioni/TaxAddForm";
import { StateContext } from "../../Context/stateContext";
import ValutaAddForm from "../../Organismi/Impostazioni/ValutaAddForm";

function DashboardImpostazioni(props) {
  let [tags, setTags] = React.useState("");
  let [tagsP, setTagsP] = React.useState("");
  const { state, dispatch } = useContext(StateContext);
  const [prodotti, setProdotti] = React.useState([]);
  const [taxes, setTaxes] = React.useState(state.taxes && state.taxes);
  const [valute, setValute] = React.useState([]);

  useEffect(() => {
    getValuteDocuments().then((d)=>{
      setValute(d)
      console.log(d)
    })
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
      console.log(prodotti);
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
  const addOneValutaPlaceholder = () => {
    const newValuta = {
      id: makeId(8),
      symbol: "",
      cambio: "",
    };
    setValute((prevValute) => [...prevValute, newValuta]);
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
              Inserisci i tag che vuoi che siano disponibili per l'upload delle
              foto separati dalla ,
            </Text>
            <TextField
              label="Tag delle Foto."
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
            <Heading level={2}>Commissioni</Heading>
            <Text>
              Inserisci le commissioni che vuoi aggiungere agli ordini nelle tue
              postazioni di vendita.
            </Text>
            {taxes && <TaxAddForm taxes={taxes} db={props.db} />}
            <ActionButton onPress={addOneTaxPlaceholder}>
              Aggiungi Commissione
            </ActionButton>
          </Flex>
          <Divider size="S" />
          <Flex direction={"column"} gap={"size-125"} alignItems={"center"}>
            <Heading level={2}>Valute</Heading>
            <Text>
              Aggiungi delle valute e il rispettivo tasso di cambio in EUR.
            </Text>
            {valute && <ValutaAddForm valute={valute} db={props.db} />}
            <ActionButton onPress={addOneValutaPlaceholder}>
              Aggiungi Valuta
            </ActionButton>
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
}

export default DashboardImpostazioni;

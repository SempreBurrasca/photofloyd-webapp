import React, { useContext, useEffect, useState } from "react";
import {
  ActionButton,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Heading,
  NumberField,
  Text,
  TextField,
  View,
  Well,
} from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import {
  getPostazioneDoc,
  getProductsFromFirebase,
  getProductsFromSettingsPostazione,
  getTagsFromFirebase,
  resetUploadCounter,
  saveProductsToSettingsPostazione,
  saveTagsPostazioneToFirebase,
  saveTagsToFirebase,
  saveTagsToSettingsPostazione,
} from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import SaveAsFloppy from "@spectrum-icons/workflow/SaveAsFloppy";
import ProductAddForm from "../../Organismi/Impostazioni/ProductAddForm";
import {
  getTagsFromSettingsPostazione,
  getTagsPostazioneFromFirebase,
} from "../../Functions/firebaseGetFunctions";
import TaxAddForm from "../../Organismi/Impostazioni/TaxAddForm";
import { StateContext } from "../../Context/stateContext";

function PostazioneImpostazioni(props) {
  const { postazioneId } = props;
  const [tags, setTags] = React.useState("");
  const { state, dispatch } = useContext(StateContext);
  const [prodotti, setProdotti] = useState([]);
  const [counter, setCounter] = React.useState(
    state.currentPostazione && state.currentPostazione.uploadCounter
  );
  const [selectedProducts, setSelectedProducts] = useState([]);
  useEffect(() => {
    getProductsFromFirebase(props.db).then((prodotti) => {
      setProdotti(prodotti);
    });
    getProductsFromSettingsPostazione(postazioneId).then((prd) => {
      if (prd.length > 0) {
        let arr = [];
        prd.forEach((p) => {
          arr.push(p.nome);
        });
        setSelectedProducts(arr);
      }
    });
    getTagsFromSettingsPostazione(postazioneId).then((_tags) => {
      if (_tags) {
        setTags(_tags.join(","));
      } else {
        getTagsFromFirebase(props.db).then((__tags) => {
          let arr = [];
          __tags.map((tag) => {
            arr.push(tag.name);
          });
          setTags(arr.join(","));
        });
      }
    });
  }, []);
  useEffect(() => {}, [tags]);
  const filterObjectsByName = (objects, names) => {
    return objects.filter((object) => names.includes(object.nome));
  };
  return (
    <View padding={10} paddingBottom={50} maxHeight={"60vh"}>
      <Flex
        direction={"column"}
        minHeight="100vh"
        alignItems={"center"}
        gap="size-130"
      >
        <Heading level={1}>Impostazioni</Heading>
        <Text>
          Qui puoi personalizzare le impostazioni della singola postazione.
        </Text>
        <Divider size="M" />
        <Flex direction={"column"} width={"70%"} gap={"size-325"}>
          <Flex direction={"column"} gap={"size-100"}>
            <Heading level={2}>Upload</Heading>
            <Text>Il contatore degli upload effettuati</Text>
            <Well>
              Attenzione! Se si resetta il contatore o si diminuisce i futuri
              upload sovrascriveranno quelli attualmente esistenti
            </Well>
            <NumberField
              label="Contatore"
              value={counter}
              onChange={setCounter}
            />
            <ActionButton
              onPress={() => {
                resetUploadCounter(postazioneId, counter);
                getPostazioneDoc(props.db, postazioneId, console.log, dispatch);
              }}
            >
              Resetta Contatore
            </ActionButton>
          </Flex>
          <Divider size="S" />
          <Flex direction={"column"} gap={"size-100"}>
            <Heading level={2}>Tags</Heading>

            <Text>
              Inserisci i tag che vuoi che siano disponibili per le foto
              separati dalla ,
            </Text>
            <TextField
              label="Tag delle foto."
              width={"100%"}
              onChange={setTags}
              value={tags}
            />
            <ActionButton
              onPress={() => {
                saveTagsToSettingsPostazione(tags, postazioneId);
              }}
            >
              Salva Tags
            </ActionButton>
          </Flex>
          <Divider size="S" />
          <Flex direction={"column"} gap={"size-100"}>
            <Heading level={2}>Vendita</Heading>
            <Text>
              Seleziona i prodotti che saranno venduti in questa postazione.
            </Text>
            <CheckboxGroup
              label="Prodotti"
              value={selectedProducts}
              onChange={setSelectedProducts}
            >
              {prodotti &&
                prodotti.length > 0 &&
                prodotti.map((prodotto) => (
                  <Checkbox key={prodotto.doc.id} value={prodotto.nome}>
                    {prodotto.nome} - {prodotto.descrizione}
                  </Checkbox>
                ))}
            </CheckboxGroup>
            <ActionButton
              isDisabled={prodotti.length === 0}
              onPress={() => {
                saveProductsToSettingsPostazione(
                  filterObjectsByName(prodotti, selectedProducts),
                  postazioneId
                );
              }}
            >
              Salva Lista Prodotti
            </ActionButton>
            <br />
            <br />
            <br />
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
}

export default PostazioneImpostazioni;

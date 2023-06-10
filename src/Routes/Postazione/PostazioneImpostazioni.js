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
  const [taxes, setTaxes] = React.useState(state.taxes && state.taxes);

  useEffect(() => {
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
            <Heading level={2}>Tags</Heading>

            <Text>
              Inserisci i tag che vuoi che siano disponibili per le foto separati dalla ,
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
        </Flex>
      </Flex>
    </View>
  );
}

export default PostazioneImpostazioni;

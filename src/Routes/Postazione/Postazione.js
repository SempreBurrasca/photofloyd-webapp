import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import LayoutDiSezione from "../../Layouts/LayoutDiSezione";
import { doc, getDoc } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import {
  ActionButton,
  ActionGroup,
  Divider,
  Flex,
  Grid,
  Header,
  Heading,
  Item,
  TabList,
  Tabs,
  Text,
  View,
} from "@adobe/react-spectrum";
import Star from "@spectrum-icons/workflow/Star";
import Label from "@spectrum-icons/workflow/Label";
import Folder from "@spectrum-icons/workflow/Folder";
import Shop from "@spectrum-icons/workflow/Shop";
import Delete from "@spectrum-icons/workflow/Delete";
import { TagGroup } from "@react-spectrum/tag";
import { makeId } from "../../Functions/logicArray";
import ImageAdd from "@spectrum-icons/workflow/ImageAdd";

function Postazione(props) {
  React.useEffect(() => {
    getPostazioneDoc();
    console.log(postazione);
  }, []);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  let { postazioneId } = useParams();
  let [postazione, setPostazione] = React.useState(null);

  const getPostazioneDoc = async () => {
    const docRef = doc(props.db, "postazioni", postazioneId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPostazione(docSnap.data());
      console.log("Documento recuperato con successo");
    } else {
      // docSnap.data() will be undefined in this case
      console.log("Non c'è il documento da recuperare (impostazioni=>tag)'");
    }
  };

  return (
    <LayoutConHeader>
      <Grid
        areas={["sidebar divider content"]}
        columns={["1fr", "0.03fr", "3fr"]}
        gap="size-100"
        height="80vh"
        margin={10}
      >
        <View gridArea="sidebar">
          <Flex direction="column" gap="size-200">
            <Flex direction="column" gap="size-100">
              <Heading>Azioni Speciali</Heading>
              <Text>Seleziona una o più foto per operare azioni multiple.</Text>
              <ActionGroup orientation="vertical" isJustified density="compact">
                <Item key="edit">
                  <Star />
                  <Text>Valuta</Text>
                </Item>
                <Item key="copy">
                  <Label />
                  <Text>Aggiungi Tag</Text>
                </Item>
                <Item key="delete">
                  <Folder />
                  <Text>Aggiungi a cartella</Text>
                </Item>
                <Item key="move">
                  <Shop />
                  <Text>Vendi</Text>
                </Item>
                <Item key="duplicate">
                  <Delete />
                  <Text>Elimina</Text>
                </Item>
              </ActionGroup>
            </Flex>
            <Divider size="M" />
            <Flex direction="column" gap="size-100">
              <Heading>Filtra e Ricerca</Heading>
              <Text>
                Utilizza i seguenti componenti per cercare delle foto specifiche
              </Text>
            </Flex>
          </Flex>
        </View>

        <Divider orientation="vertical" size="M" />

        <View gridArea="content">
          <Flex direction="column" gap="size-200" justifyContent={"center"}>
            <Flex
              gap="size-100"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Flex direction="column" gap="size-100">
                <Flex gap="size-100" justifyContent="start">
                  <a>Home{">"} </a>
                  <span>{postazione && postazione.name}</span>
                </Flex>
                <h1>{postazione && postazione.name}</h1>
                {postazione && (
                <TagGroup items={postazione.tag} aria-label="Tag ">
                  {(item, index) => (
                    <Item key={item.id + "-" + makeId(3)}>{item.name}</Item>
                  )}
                </TagGroup>
              )}
              </Flex>              
              <ActionButton>
                <ImageAdd /> Carica Foto
              </ActionButton>
            </Flex>
            <Tabs
              aria-label="Menu della dashboard generale"
              isEmphasized
              onSelectionChange={(key) => console.log(key)}
              defaultSelectedKey="Fotografie"
            >
              <TabList>
                <Item key="Fotografie">Fotografie</Item>
                <Item key="Staff">Staff</Item>
                <Item key="Impostazioni">Impostazioni</Item>
                <Item key="Finanze">Finanze</Item>
              </TabList>
            </Tabs>
          </Flex>
        </View>
      </Grid>
    </LayoutConHeader>
  );
}

export default Postazione;

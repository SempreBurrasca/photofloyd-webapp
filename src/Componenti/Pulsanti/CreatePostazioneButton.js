import React from "react";
import {
  DialogTrigger,
  Flex,
  Item,
  Content,
  Dialog,
  Divider,
  Heading,
  Button,
  ButtonGroup,
  Header,
  Text,
  TextField,
  ActionButton,
  ToggleButton,
} from "@adobe/react-spectrum";
import ProjectAdd from "@spectrum-icons/workflow/ProjectAdd";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { TagGroup } from "@react-spectrum/tag";
import "./style.scss";
import { onlyUnique, makeId } from "../../Functions/logicArray";
import { ToastQueue } from "@react-spectrum/toast";
import {
  getTags,
  getTagsPostazioneFromFirebase,
} from "../../Functions/firebaseGetFunctions";
import { creaPostazione } from "../../Functions/firebaseFunctions";

function CreatePostazioneButton(props) {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = props.db;
  let [newPostazioneName, setNewPostazioneName] = React.useState("");
  let [newPostazioneTag, setNewPostazioneTag] = React.useState([]);
  let [tagSelected, setTagSelected] = React.useState([]);

  const recuperaTag = async () => {
    getTagsPostazioneFromFirebase().then((_tags) => {
      setNewPostazioneTag(_tags);
    });
  };
  const resetState = () => {
    setNewPostazioneName("");
    setTagSelected([]);
  };
  //manca da completare la logica che impedisca duplicati
  const aggiungiTag = (item) => {
    setTagSelected((tagSelected) => [...tagSelected, { id: item, name: item }]);
  };
  //manca da completare la logica di rimozione del tag
  const rimuoviItem = (item) => {
    console.log(item);
    let newArr = [...new Set(tagSelected)];
    console.log(newArr.filter(onlyUnique));
  };
  //manca da completare la logica di aggiunta del team

  const callCreaPostazione = async (close) => {
    const idPostazione = `${newPostazioneName.replaceAll(" ", "-")}-${makeId(5)}`;
    const user = auth.currentUser;
  
    creaPostazione(newPostazioneName,tagSelected,close)
  };
  
  
  
  
  return (
    <DialogTrigger
      onOpenChange={(e) => {
        e ? recuperaTag() : resetState();
      }}
    >
      <ActionButton key="postazione">
        <ProjectAdd />
        Crea Postazione
      </ActionButton>
      {(close) => (
        <Dialog>
          <Heading>Crea una nuova Postazione</Heading>
          <Header>Connection status: Connected</Header>
          <Divider />
          <Content>
            <Flex direction={"column"}>
              <Text>
                Con il seguente form puoi creare una nuova postazione di lavoro.
              </Text>
              <TextField
                label="Nome"
                type="text"
                width={"100%"}
                value={newPostazioneName}
                onChange={setNewPostazioneName}
              />
              {newPostazioneTag && (
                <TagGroup
                  items={newPostazioneTag}
                  label="Tag"
                  aria-label="Tag selezionabili per la postazione"
                >
                  {(item) => (
                    <Item key={item.id}>
                      <a
                        className="tag-button"
                        onClick={() => aggiungiTag(item.name)}
                      >
                        {item.name}
                      </a>
                    </Item>
                  )}
                </TagGroup>
              )}
              {tagSelected.length > 0 && (
                <TagGroup
                  items={tagSelected}
                  label="Tag Selezionati"
                  aria-label="Tag selezionabili per la postazione"
                  allowsRemoving
                  onRemove={rimuoviItem}
                >
                  {(item, index) => (
                    <Item key={item.id + "-" + makeId(3)}>{item.name}</Item>
                  )}
                </TagGroup>
              )}
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Annulla
            </Button>
            <Button variant="accent" onPress={()=>callCreaPostazione(close)}>
              Crea Postazione
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default CreatePostazioneButton;

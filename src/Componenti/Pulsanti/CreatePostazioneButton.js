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
} from "@adobe/react-spectrum";
import ProjectAdd from "@spectrum-icons/workflow/ProjectAdd";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function CreatePostazioneButton(props) {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = props.db;
  let [newPostazioneName, setNewPostazioneName] = React.useState("");
  let [newPostazioneTag, setNewPostazioneTag] = React.useState([]);
  let [newPostazioneStaff, setNewPostazioneStaff] = React.useState([]);

  const recuperaTag = async () => {
    const docRef = doc(props.db, "impostazioni", "tag");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  return (
    <DialogTrigger onOpenChange={(e)=>{e&&recuperaTag()}}>
      <ActionButton key="utente">
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
      
              />
              <TextField
                label="E-mail"
                type="email"
                width={"100%"}

              />
              <TextField
                label="Telefono"
                type="text"
                width={"100%"}
    
              />
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Annulla
            </Button>
            <Button variant="accent" onPress={close}>
              Crea Postazione
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default CreatePostazioneButton;

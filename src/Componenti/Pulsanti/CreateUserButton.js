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
} from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import UserAdd from "@spectrum-icons/workflow/UserAdd";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function CreateUserButton(props) {
  const navigate = useNavigate();
  const auth = getAuth();
  let [newUserName, setNewUserName] = React.useState("");
  let [newUserMail, setNewUserMail] = React.useState("");
  let [newUserPhone, setNewUserPhone] = React.useState("");

  const createUser = () => {
    auth
      .createUser({
        email: newUserMail,
        emailVerified: false,
        phoneNumber: newUserPhone,
        password: "Photofloyd123!",
        displayName: newUserName,
        photoURL: "https://placehold.co/400",
        disabled: false,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
      });
  };

  return (
    <DialogTrigger>
      <Item key="utente">
        <UserAdd />
        Crea Utente
      </Item>
      {(close) => (
        <Dialog>
          <Heading>Aggiungi un nuovo utente</Heading>
          <Header>Connection status: Connected</Header>
          <Divider />
          <Content>
            <Flex direction={"column"}>
              <Text>
                Inserisci il nome e l'indirizzo e-mail dell'utente da
                aggiungere. La password assegnata di default è Photofloyd123!{" "}
              </Text>
              <TextField
                label="Nome"
                type="text"
                width={"100%"}
                value={newUserName}
                onChange={setNewUserName}
              />
              <TextField
                label="E-mail"
                type="email"
                width={"100%"}
                value={newUserMail}
                onChange={setNewUserMail}
              />
              <TextField
                label="Telefono"
                type="text"
                width={"100%"}
                value={newUserPhone}
                onChange={setNewUserPhone}
              />
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Annulla
            </Button>
            <Button variant="accent" onPress={createUser}>
              Aggiungi Utente
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default CreateUserButton;

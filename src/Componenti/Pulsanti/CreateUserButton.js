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
import { useNavigate } from "react-router-dom";
import UserAdd from "@spectrum-icons/workflow/UserAdd";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createUser } from "../../Functions/firebaseFunctions";

function CreateUserButton(props) {
  const navigate = useNavigate();
  const auth = getAuth();
  let [newUserName, setNewUserName] = React.useState("");
  let [newUserMail, setNewUserMail] = React.useState("");
  let [newUserRole, setNewUserRole] = React.useState("");

  return (
    <DialogTrigger>
      <ActionButton key="utente">
        <UserAdd />
        Crea Utente
      </ActionButton>
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
                label="Ruolo"
                type="text"
                width={"100%"}
                value={newUserRole}
                onChange={setNewUserRole}
              />
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Annulla
            </Button>
            <Button
              variant="accent"
              onPress={() => {
                createUser(
                  newUserMail,
                  "Photofloyd123!",
                  newUserName,
                  newUserRole
                );
              }}
            >
              Aggiungi Utente
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default CreateUserButton;

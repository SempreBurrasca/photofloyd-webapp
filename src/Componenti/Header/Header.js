import React from "react";
import {
  ActionButton,
  ActionGroup,
  DialogTrigger,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  TabList,
  Tabs,
  View,
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
import { Avatar } from "@react-spectrum/avatar";
import { useNavigate } from "react-router-dom";
import UserAdd from "@spectrum-icons/workflow/UserAdd";
import ProjectAdd from "@spectrum-icons/workflow/ProjectAdd";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function HeaderPhotofloyd(props) {
  const navigate = useNavigate();
  const auth = getAuth();

  const createUser = (email,password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  return (
    <Flex minHeight="size-675" gap="size-400" alignItems={"center"}>
      <View
        flex={1}
        paddingTop="size-200"
        paddingBottom="size-200"
        paddingStart="size-800"
      >
        <Flex
          direction="row"
          gap="size-400"
          justifyContent="start"
          alignItems={"center"}
        >
          <View>
            <h3>Photofloyd</h3>
          </View>
          <View>
            {/*AGGIUNGERE FUNZIONE CHE RENDE ATTIVA LA TAB IN BASE ALLA ROUTE*/}
            <Tabs
              aria-label="Menu della dashboard generale"
              isEmphasized
              onSelectionChange={(key) => navigate(key)}
              defaultSelectedKey="postazioni"
            >
              <TabList>
                <Item key="">Postazioni</Item>
                <Item key="staff">Staff</Item>
                <Item key="finanze">Finanze</Item>
                <Item key="impostazioni">Impostazioni</Item>
                <Item key="aiuto">Aiuto</Item>
              </TabList>
            </Tabs>
          </View>
        </Flex>
      </View>
      <View
        flex={1}
        paddingTop="size-200"
        paddingBottom="size-200"
        paddingEnd="size-800"
      >
        <Flex
          direction="row"
          gap="size-400"
          justifyContent="end"
          alignItems={"center"}
        >
          <View>
            <ActionGroup isJustified>
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
                          aggiungere. La password assegnata di default è
                          Photofloyd123!{" "}
                        </Text>
                        <TextField label="Nome" type="text" width={"100%"} />
                        <TextField label="E-mail" type="email" width={"100%"} />
                      </Flex>
                    </Content>
                    <ButtonGroup>
                      <Button variant="secondary" onPress={close}>
                        Annulla
                      </Button>
                      <Button variant="accent" onPress={close}>
                        Aggiungi Utente
                      </Button>
                    </ButtonGroup>
                  </Dialog>
                )}
              </DialogTrigger>
              <DialogTrigger>
                <Item key="postazione">
                  <ProjectAdd />
                  Crea Postazione
                </Item>
                {(close) => (
                  <Dialog>
                    <Heading>Crea una nuova postazione</Heading>
                    <Header>Connection status: Connected</Header>
                    <Divider />
                    <Content>
                      <Text>Start speed test?</Text>
                    </Content>
                    <ButtonGroup>
                      <Button variant="secondary" onPress={close}>
                        Cancel
                      </Button>
                      <Button variant="accent" onPress={close}>
                        Confirm
                      </Button>
                    </ButtonGroup>
                  </Dialog>
                )}
              </DialogTrigger>
            </ActionGroup>
          </View>
          <View>
            <MenuTrigger>
              <ActionButton>
                <Avatar
                  src="https://i.imgur.com/kJOwAdv.png"
                  alt="default Adobe avatar"
                  size="avatar-size-700"
                />
              </ActionButton>
              <Menu onAction={(key) => navigate(key)}>
                <Item key="profilo">Profilo</Item>
                <Item key="logout">Logout</Item>
              </Menu>
            </MenuTrigger>
          </View>
        </Flex>
      </View>
    </Flex>
  );
}

export default HeaderPhotofloyd;

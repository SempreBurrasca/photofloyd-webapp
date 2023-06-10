import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import {
  Button,
  ButtonGroup,
  ComboBox,
  Content,
  DateRangePicker,
  Dialog,
  Divider,
  Flex,
  Header,
  Heading,
  Item,
  Switch,
  Text,
  TextField,
} from "@adobe/react-spectrum";

import { addPhotosToClients } from "../../Functions/firebaseFunctions";
import { getClienti } from "../../Functions/firebaseGetFunctions";

function DialogAddToClient(props) {
  const { close, selectedFotos } = props;
  let [selectedClients, setSelectedClients] = React.useState(false);
  const [clients, setClients] = useState([]);
  const [exist, setExist] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientStanza, setClientStanza] = useState("");
  const [clientData, setClientData] = useState({});
  const [clientMail, setClientMail] = useState("");
  const [clientCF, setClientCF] = useState("");
  useEffect(() => {
    getClienti(props.db, props.postazioneId, setClients);
  }, []);
  const handleSelection = (e) => {
    console.log(e);
    setSelectedClients([e]);
  };
  return (
    <Dialog>
      <Heading>Collega foto a un cliente</Heading>
      <Header>Connection status: Connected</Header>
      <Divider />
      <Content>
        <Text>
          Aggiungi {selectedFotos.length} fotografie a un cliente, puoi
          selezionarne di già esistenti o crearne una nuovo.
        </Text>
        <Switch isSelected={exist} onChange={setExist}>
          Il cliente già è stato salvato nella postazione
        </Switch>
        <br />
        {exist ? (
          <ComboBox
            defaultItems={clients}
            onSelectionChange={handleSelection}
            width={"100%"}
          >
            {(item) => <Item key={item.id}>{item.id}</Item>}
          </ComboBox>
        ) : (
          <Flex direction={"column"}>
            <Text>
              Crea un nuovo cliente e aggiungi le foto selezionate a esso.
            </Text>
            <Flex direction="column" gap="size-100">
              <Flex gap="size-200" alignItems="end">
                <TextField
                  label="Nome Cliente"
                  flex={2}
                  value={clientName}
                  onChange={setClientName}
                  isRequired
                />
                <TextField
                  label="Numero Stanza"
                  flex={2}
                  value={clientStanza}
                  onChange={setClientStanza}
                />
              </Flex>
              <Flex gap="size-200" alignItems="end">
                <TextField
                  label="Codice Fiscale"
                  flex={2}
                  value={clientCF}
                  onChange={setClientCF}
                />
              </Flex>
              <Flex gap="size-200" alignItems="end">
                <TextField
                  label="E-mail"
                  flex={2}
                  value={clientMail}
                  onChange={setClientMail}
                />
              </Flex>
              <Flex gap="size-200" alignItems="end">
                <DateRangePicker
                  label="Check in e Check Out"
                  width="100%"
                  flex={1}
                  value={clientData}
                  onChange={setClientData}
                  shouldFlip
                />
              </Flex>
            </Flex>
          </Flex>
        )}

        <br />
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Annulla
        </Button>
        <Button
          variant="accent"
          isDisabled={exist ? !selectedClients : !clientName}
          onPress={() => {
            addPhotosToClients(
              props.db,
              props.postazioneId,
              selectedClients.concat([clientName]),
              selectedFotos,
              {
                stanza: clientStanza,
                mail: clientMail,
                data: {
                  start: new Date(
                    clientData.start.year,
                    clientData.start.month - 1,
                    clientData.start.day
                  ),
                  end: new Date(
                    clientData.end.year,
                    clientData.end.month - 1,
                    clientData.end.day
                  ),
                },
                cf: clientCF,
              }
            ).then((e) => {
              props.setSelectedFotos([]);
              close();
            });
          }}
        >
          Conferma
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogAddToClient;

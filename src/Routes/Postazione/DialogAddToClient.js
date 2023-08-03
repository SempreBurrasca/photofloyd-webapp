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
  DatePicker,
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
  const [searchText, setSearchText] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [searchDateRange, setSearchDateRange] = useState(null);

  useEffect(() => {
    getClienti(props.db, props.postazioneId, setClients);
  }, []);
  useEffect(() => {
    console.log(clients);
  }, [clients]);
  useEffect(() => {
    console.log("DATA =>",searchDateRange);
  }, [searchDateRange]);
  const handleSelection = (e) => {
    setSelectedClients([e]);
  };

  const filteredClients = clients.filter((client) => {

    const clientStartDate = client.data.data?client.data.data.start.toDate():null
    const clientEndDate =  client.data.data?client.data.data.end.toDate():null
console.log(client,clientStartDate,clientEndDate,searchDateRange)
    if (
      searchText !== "" &&
      !client.id.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false;
    }

    if (roomNumber !== "" && client.data.stanza !== roomNumber) {
      return false;
    }

    if (searchDateRange) {
      const searchDate = new Date(searchDateRange.year, searchDateRange.month - 1, searchDateRange.day);
      if (searchDate < clientStartDate || searchDate > clientEndDate) {
        return false;
      }
    }

    return true;
});

  return (
    <Dialog>
      <Heading>Collega foto a un cliente</Heading>
      <Header>Connection status: Connected</Header>
      <Divider />
      <Content>
        <Flex direction={"column"}>
          <Text>
            Aggiungi {selectedFotos.length} fotografie a un cliente, puoi
            selezionarne di già esistenti o crearne una nuovo.
          </Text>
          <Switch isSelected={exist} onChange={setExist}>
            Il cliente già è stato salvato nella postazione
          </Switch>
        </Flex>
        <br />
        {exist ? (
          <Flex direction={"column"}>
            {/*Aggiungere la logica di ricerca del cliente per numero di stanza e data di check in check out*/}
            <ComboBox
              defaultItems={filteredClients}
              onSelectionChange={handleSelection}
              width={"100%"}
            >
              {(item) => <Item key={item.id}>{item.id}</Item>}
            </ComboBox>

            <TextField
              label="Numero Stanza"
              value={roomNumber}
              onChange={setRoomNumber}
              isRequired
            />
            <DatePicker
              label="Cerca per data"
              value={searchDateRange}
              onChange={setSearchDateRange}
            />
            {/* <DateRangePicker
              label="Cerca per data"
              value={searchDateRange}
              onChange={setSearchDateRange}
        />*/}
          </Flex>
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
                  isRequired
                />
              </Flex>
              <Flex gap="size-200" alignItems="end">
                <TextField
                  label="Numero di Telefono"
                  flex={2}
                  value={clientCF}
                  onChange={setClientCF}
                  isRequired
                />
              </Flex>
              <Flex gap="size-200" alignItems="end">
                <TextField
                  label="E-mail"
                  flex={2}
                  value={clientMail}
                  onChange={setClientMail}
                  isRequired
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
                  isRequired
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
          isDisabled={
            exist
              ? !selectedClients
              : !clientName ||
                !clientData ||
                !clientMail ||
                !clientStanza ||
                !clientCF
          }
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
                telefono: clientCF,
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

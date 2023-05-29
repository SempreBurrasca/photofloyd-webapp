import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import {
  ActionButton,
  ActionGroup,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Grid,
  Header,
  Heading,
  Image,
  Item,
  Menu,
  MenuTrigger,
  Picker,
  Switch,
  TabList,
  TabPanels,
  Tabs,
  Text,
  TextField,
  View,
  Well,
} from "@adobe/react-spectrum";
import { getClienti } from "../../Functions/firebaseGetFunctions";

function CheckOut(props) {
  const {
    close,
    selectedFotos,
    setPaymentCard,
    tassazione,
    totalOfProducts,
    handleDownload,
    postazioneId,
    checkoutData,
    finalizzaVendita,
  } = props;
  const [clienti, setClienti] = useState([]);
  const [isOldClient, setIsOldClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState();
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [codiceFiscale, setCodiceFiscal] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("EUR");
  useEffect(() => {
    getClienti(props.db, postazioneId, setClienti);
  }, []);
  const handleSelection = (e) => {
    setSelectedClient(e);
  };
  const handleCheckout = () => {
    finalizzaVendita({
      cliente: {
        clienteID: selectedClient ? selectedClient : false,
        nome: nome,
        cognome: cognome,
        codiceFiscale: codiceFiscale,
        email: email,
      },
      fotoAcquistate: props.cartFotos,
      totale: totalOfProducts(),
      postazione: postazioneId,
      tassazione: tassazione,
    });
  };
  return (
    <Flex direction={"column"} gap={"size-125"}>
      <View overflow={"auto"} maxHeight={"55vh"}>
        <Flex justifyContent={"space-evenly"} gap={"size-100"}>
          <Flex direction={"column"} gap={"size-125"} flex={1}>
            <Heading level={4}>Riepilogo</Heading>
            <Text>Nel carrello ci sono {props.cartFotos.length} prodotti</Text>
            {props.cartFotos.map((foto) => (
              <Flex gap={"size-100"}>
                <Image
                  src={foto.data.url}
                  width="50px"
                  height="50px"
                  objectFit={"cover"}
                />
                <Flex
                  direction={"column"}
                  gap={"size-100"}
                  justifyContent={"center"}
                >
                  <span>{foto.data.name}</span>
                  <Flex gap="size-100" justifyContent={"space-between"}>
                    <span>{foto.product.nome}</span>
                    <span>€ {foto.product.prezzo}</span>
                  </Flex>
                </Flex>
              </Flex>
            ))}
            <Divider size="S" />
            <Flex direction={"column"}>
              <Switch onChange={setPaymentCard}>
                Pagamento con carta di credito
              </Switch>
            </Flex>
            <Flex direction={"column"} alignSelf={"end"}>
              <Picker
                label="Seleziona valuta di pagamento"
                onSelectionChange={(selected) => setCurrency(selected)}
              >
                <Item key="EUR">Euro</Item>
                <Item key="USD">Dollaro</Item>
                <Item key="GBP">Sterlina</Item>
              </Picker>
            </Flex>
            <Flex direction={"column"} alignSelf={"end"}>
              <Text>Tassazione: {tassazione}</Text>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"end"}>
              <Heading level={5}>Totale: </Heading>
              <Text>
                {currency} {totalOfProducts(currency)}
              </Text>
            </Flex>
          </Flex>
          <Divider size="S" orientation="vertical" />
          <Flex direction={"column"} gap={"size-125"} flex={1}>
            <Heading level={4}>Anagrafica Cliente</Heading>
            <Switch onChange={setIsOldClient}>
              Cliente già registrato in una cartella
            </Switch>
            {isOldClient && (
              <Picker
                label="Scegli una versione"
                items={clienti}
                onSelectionChange={handleSelection}
                isDisabled={clienti.length > 0 ? false : true}
              >
                {(item) => <Item key={item.id}>{item.id}</Item>}
              </Picker>
            )}
            {isOldClient && (
              <Text>Aggiorna il cliente con le informazioni corrette</Text>
            )}
            <TextField
              label="Nome"
              isRequired
              width={"100%"}
              onChange={setNome}
            />
            <TextField
              label="Cognome"
              isRequired
              width={"100%"}
              onChange={setCognome}
            />
            <TextField
              label="Codice Fiscale"
              isRequired
              width={"100%"}
              onChange={setCodiceFiscal}
            />
            <TextField
              label="E-mail"
              type="email"
              isRequired
              width={"100%"}
              onChange={setEmail}
            />
          </Flex>
        </Flex>
      </View>
      <Well>
        Se hai effettuato il download dei file, inserito le informazioni del
        cliente e finalizzato la vendita, clicca sul pulsante "Conferma
        Acquisto"
      </Well>
      <ActionButton onPress={handleDownload}>
        Download File dei prodotti
      </ActionButton>
      <Button variant="cta" onPress={handleCheckout}>
        Conferma Acquisto
      </Button>
    </Flex>
  );
}

export default CheckOut;

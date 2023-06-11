import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import {
  ActionButton,
  Button,
  Checkbox,
  DateRangePicker,
  Divider,
  Flex,
  Heading,
  Image,
  Item,
  NumberField,
  Picker,
  Radio,
  RadioGroup,
  Switch,
  Text,
  TextField,
  Tooltip,
  TooltipTrigger,
  View,
  Well,
} from "@adobe/react-spectrum";
import {
  getClienti,
  getValuteDocuments,
} from "../../Functions/firebaseGetFunctions";
import { makeId } from "../../Functions/logicArray";
import Print from "@spectrum-icons/workflow/Print";
import Mailbox from "@spectrum-icons/workflow/Mailbox";
import Portrait from "@spectrum-icons/workflow/Portrait";
import Landscape from "@spectrum-icons/workflow/Landscape";
import FullScreen from "@spectrum-icons/workflow/FullScreen";
import Data from "@spectrum-icons/workflow/Data";

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
    paymentCard,
  } = props;
  const [clienti, setClienti] = useState([]);
  const [isOldClient, setIsOldClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState();
  const [nome, setNome] = useState("");
  const [stanza, setStanza] = useState("");
  const [codiceFiscale, setCodiceFiscal] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [valute, setValute] = useState([]);
  const [contantiRicevuti, setContantiRicevuti] = useState();
  const [clientData, setClientData] = useState();
  useEffect(() => {
    getClienti(props.db, postazioneId, setClienti);
    getValuteDocuments().then((d) => {
      setValute(d);
      console.log(d);
    });
  }, []);
  const handleSelection = (e) => {
    setSelectedClient(e);
  };
  const handleCheckout = () => {
    finalizzaVendita({
      cliente: {
        clienteID: selectedClient ? selectedClient : false,
        nome: nome,
        stanza: stanza,
        codiceFiscale: codiceFiscale,
        email: email,
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
      },
      fotoAcquistate: props.cartFotos,
      totale: totalOfProducts(),
      postazione: postazioneId,
      paymentCard: paymentCard,
    });
  };
  return (
    <Flex direction={"column"} gap={"size-125"}>
      <View overflow={"auto"} maxHeight={"55vh"}>
        <Flex justifyContent={"space-evenly"} gap={"size-100"}>
          <Flex direction={"column"} gap={"size-125"} flex={1}>
            <Text>Nel carrello ci sono {props.cartFotos.length} prodotti</Text>
            <View
              maxHeight={"30vh"}
              overflow={"auto"}
              backgroundColor={"gray-200"}
              padding={10}
              borderRadius={"10px"}
            >
              <Flex direction={"column"} gap={"size-115"}>
                {props.cartFotos.map((foto, index) => (
                  <React.Fragment
                    key={
                      foto.data.name + "-" + foto.product.nome + "-" + makeId(3)
                    }
                  >
                    <Flex gap={"size-100"} alignItems={"center"}>
                      <span>{index + 1}</span>
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
                        <Flex gap="size-100">
                          {foto.product.isStampa ? (
                            <TooltipTrigger delay={0}>
                              <Print size="S" />
                              <Tooltip>Stampa</Tooltip>
                            </TooltipTrigger>
                          ) : (
                            <TooltipTrigger delay={0}>
                              <Data size="S" />
                              <Tooltip>File Digitale</Tooltip>
                            </TooltipTrigger>
                          )}
                          {console.log(foto.product)}
                          {foto.product.isStampa &&
                          foto.product.orientation &&
                          foto.product.orientation === "horizontal" ? (
                            <TooltipTrigger delay={0}>
                              <Landscape size="S" />
                              <Tooltip>Formato Orizzontale</Tooltip>
                            </TooltipTrigger>
                          ) : (
                            <TooltipTrigger delay={0}>
                              <Portrait size="S" />
                              <Tooltip>Formato Verticale</Tooltip>
                            </TooltipTrigger>
                          )}
                          {foto.product.isStampa && foto.product.fillCanvas && (
                            <TooltipTrigger>
                              <FullScreen size="S" />
                              <Tooltip>Cover Fit</Tooltip>
                            </TooltipTrigger>
                          )}
                          {foto.product.isSpedizione && (
                            <TooltipTrigger>
                              <Mailbox size="S" />
                            </TooltipTrigger>
                          )}
                        </Flex>
                      </Flex>
                    </Flex>
                    {index !== props.cartFotos.length - 1 && (
                      // Don't add divider after last element
                      <Divider size="S" />
                    )}
                  </React.Fragment>
                ))}
              </Flex>
            </View>
            <Divider size="S" />
            <Flex direction={"column"} gap={"size-100"}>
              <Flex gap={"size-100"}>
                <RadioGroup
                  label="Metodo di pagamento"
                  orientation="horizontal"
                  value={paymentCard}
                  onChange={setPaymentCard}
                >
                  <Radio value={0}>Contanti</Radio>
                  <Radio value={1}>Carta di credito</Radio>
                  <Radio value={2}>Bonifico</Radio>
                </RadioGroup>
                <Picker
                  label="Seleziona valuta di pagamento"
                  items={valute}
                  onSelectionChange={(selected) =>
                    setCurrency(valute.find((item) => item.symbol === selected))
                  }
                >
                  {(item) => <Item key={item.symbol}>{item.symbol}</Item>}
                </Picker>
              </Flex>
              <Flex gap={"size-100"} alignItems={"end"} direction={"column"}>
                <Flex alignItems={"center"} justifyContent={"start"}>
                  <Heading level={4}>Totale da Pagare: </Heading>
                  <Text>
                    {currency.symbol ? currency.symbol : "EUR"}{" "}
                    {totalOfProducts(currency)}
                  </Text>
                </Flex>
                {paymentCard === 0 && (
                  <NumberField
                    isQuiet
                    label="Contanti ricevuti"
                    value={contantiRicevuti}
                    onChange={setContantiRicevuti}
                  />
                )}
                {paymentCard === 0 && (
                  <span>
                    Resto da dare: {currency.symbol ? currency.symbol : "EUR"}
                    {(contantiRicevuti - totalOfProducts(currency)).toFixed(2)}
                  </span>
                )}
              </Flex>
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
            <Flex direction={"column"} gap={"size-100"}>
              <TextField
                label="Nome e Cognome"
                isRequired
                width={"100%"}
                onChange={setNome}
              />
              <Flex gap="size-100">
                <TextField
                  label="Numero Stanza"
                  isRequired
                  width={"100%"}
                  onChange={setStanza}
                  flex={1}
                />
                <DateRangePicker
                  label="Check in e Check Out"
                  width="100%"
                  value={clientData}
                  onChange={setClientData}
                  shouldFlip
                  flex={3}
                  isRequired
                />
              </Flex>
              <TextField
                label="E-mail"
                type="email"
                isRequired
                width={"100%"}
                onChange={setEmail}
              />
              <TextField
                label="Codice Fiscale"
                isRequired
                width={"100%"}
                onChange={setCodiceFiscal}
              />
              <Checkbox>Accetta i Termini e Condizioni</Checkbox>
              <Checkbox>Accetta di condividere le proprie foto per la pubblicazione sui social</Checkbox>
            </Flex>
          </Flex>
        </Flex>
      </View>
      <Button variant="cta" onPress={handleCheckout} isDisabled={!nome||!codiceFiscale||!clientData||!stanza||!email}>
        Conferma Acquisto
      </Button>
    </Flex>
  );
}

export default CheckOut;

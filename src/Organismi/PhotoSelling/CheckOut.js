import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

import LayoutConHeader from "../../Layouts/LayoutConHeader";
import RicercaCliente from "./RicercaCliente";

import Print from "@spectrum-icons/workflow/Print";
import Mailbox from "@spectrum-icons/workflow/Mailbox";
import Portrait from "@spectrum-icons/workflow/Portrait";
import Landscape from "@spectrum-icons/workflow/Landscape";
import FullScreen from "@spectrum-icons/workflow/FullScreen";
import Data from "@spectrum-icons/workflow/Data";

function CheckOut(props) {
  const {
    checkoutData,
    close,
    finalizzaVendita,
    handleDownload,
    paymentCard,
    postazioneId,
    selectedFotos,
    setPaymentCard,
    tassazione,
    totalOfProducts,
  } = props;
  
  const [clienti, setClienti] = useState([]);
  const [clientData, setClientData] = useState();
  const [codiceFiscale, setCodiceFiscal] = useState("");
  const [contantiRicevuti, setContantiRicevuti] = useState();
  const [currency, setCurrency] = useState("EUR");
  const [datiSpedizione, setDatiSpedizione] = useState({
    citta: "---", cap: "---", indirizzo: "---", note: "---"
  });
  const [email, setEmail] = useState("");
  const [isOldClient, setIsOldClient] = useState(false);
  const [isSped, setIsSped] = useState(false);
  const [nome, setNome] = useState("");
  const [selectedClient, setSelectedClient] = useState();
  const [sconto, setSconto] = useState(0);
  const [stanza, setStanza] = useState("");
  const [valute, setValute] = useState([]);

  useEffect(() => {
    getClienti(props.db, postazioneId, setClienti);
    getValuteDocuments().then((d) => {
      setValute(d);
    });
  }, []);

  useEffect(() => {
    if (selectedClient && selectedClient.length > 0) {
      const selectedClientName = selectedClient[selectedClient.length - 1];
      const selectedClientData = clienti.find((client) => client.id === selectedClientName);

      if (selectedClientData && selectedClientData.data) {
        setNome(selectedClientData.id);
        setStanza(selectedClientData.data.stanza);
        setClientData({
          startDate: new Date(selectedClientData.data.data.start.toDate()),
          endDate: new Date(selectedClientData.data.data.end.toDate()),
        });
        setEmail(selectedClientData.data.email);
        setCodiceFiscal(selectedClientData.data.telefono);

        if (selectedClientData.data.datiSpedizione) {
          setDatiSpedizione({
            citta: selectedClientData.data.datiSpedizione.citta,
            cap: selectedClientData.data.datiSpedizione.cap,
            indirizzo: selectedClientData.data.datiSpedizione.indirizzo,
            note: selectedClientData.data.datiSpedizione.note,
          });
        }
      }
    }
    
  }, [selectedClient]);
useEffect(()=>{console.log(datiSpedizione)},[datiSpedizione])
  useEffect(() => {
    props.cartFotos.forEach((f) => {
      if (f.product.isSpedizione) {
        setIsSped(true);
      }
    });
  }, [props.cartFotos]);

  const checkIsSped = (arr) => {
    let check = false;
    arr.forEach((a) => {
      if (a.product.isSpedizione) {
        check = true;
      }
    });
    return check;
  };

  const handleCheckout = () => {
    console.log(datiSpedizione)
    finalizzaVendita({
      cliente: {
        clienteID: selectedClient ? selectedClient : false,
        nome: nome,
        stanza: stanza,
        telefono: codiceFiscale,
        datiSpedizione: datiSpedizione,
        email: email,
        data: {
          start: new Date(clientData.start.year, clientData.start.month - 1, clientData.start.day),
          end: new Date(clientData.end.year, clientData.end.month - 1, clientData.end.day),
        },
      },
      valuta: currency,
      totaleContantiRicevuti: contantiRicevuti || 0, // utilizza 0 se contantiRicevuti è undefined
      isSped: isSped,
      pagamento: paymentCard,
      totalePagato: (totalOfProducts()-sconto),
      totaleImponibile: (totalOfProducts()-sconto) - ((totalOfProducts()-sconto) * (tassazione / 100)),
      totaleTasse: (totalOfProducts()-sconto) * (tassazione / 100),
      sconto: sconto,
      checkoutData: checkoutData,
      fotoAcquistate:props.cartFotos,
      postazione:postazioneId
    });
    handleDownload(makeId(20));
    close();
  };
  return (
    <Flex direction={"column"} gap={"size-125"}>
      <View overflow={"auto"}>
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
                        src={foto.anteprimaStampa?foto.anteprimaStampa:foto.data.url}
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
                <NumberField
                  isQuiet
                  label="Sconto"
                  value={sconto}
                  onChange={setSconto}
                />
                <Flex alignItems={"center"} justifyContent={"start"}>
                  <Heading level={4}>Totale da Pagare: </Heading>
                  <Text>
                    {currency.symbol ? currency.symbol : "EUR"}{" "}
                    {totalOfProducts(currency)-sconto}
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
                    {(contantiRicevuti - (totalOfProducts(currency)-sconto).toFixed(2))}
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
              <RicercaCliente
                db={props.db}
                postazioneId={postazioneId}
                setSelectedClient={setSelectedClient}
              />
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
                value={nome}
              />
              <Flex gap="size-100">
                <TextField
                  label="Numero Stanza"
                  isRequired
                  width={"100%"}
                  onChange={setStanza}
                  flex={1}
                  value={stanza}
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
                value={email}
              />
              <TextField
                label="Telefono"
                isRequired
                width={"100%"}
                onChange={setCodiceFiscal}
                value={codiceFiscale}
              />
              {isSped && <Divider size="S" />}
              {isSped && (
                <Flex direction="column" gap="size-100">
                  <Flex gap="size-100">
                    <TextField
                      label="Città"
                      isRequired
                      width={"100%"}
                      value={datiSpedizione.citta}
                      onChange={(value) =>
                        setDatiSpedizione({ ...datiSpedizione, citta: value })
                      }
                      flex={1}
                    />
                    <TextField
                      label="Cap"
                      isRequired
                      width={"100%"}
                      value={datiSpedizione.cap}
                      onChange={(value) =>
                        setDatiSpedizione({ ...datiSpedizione, cap: value })
                      }
                      flex={1}
                    />
                    <TextField
                      label="Indirizzo Spedizione"
                      flex={4}
                      isRequired
                      width={"100%"}
                      value={datiSpedizione.indirizzo}
                      onChange={(value) =>
                        setDatiSpedizione({
                          ...datiSpedizione,
                          indirizzo: value,
                        })
                      }
                    />
                  </Flex>
                  <TextField
                    label="Note"
                    width={"100%"}
                    value={datiSpedizione.note}
                    onChange={(value) =>
                      setDatiSpedizione({ ...datiSpedizione, note: value })
                    }
                  />
                </Flex>
              )}
              <Checkbox>Accetta i Termini e Condizioni</Checkbox>
              <Checkbox>
                Accetta di condividere le proprie foto per la pubblicazione sui
                social
              </Checkbox>
            </Flex>
          </Flex>
        </Flex>
      </View>
      <Button
        variant="cta"
        onPress={handleCheckout}
        isDisabled={!nome || !codiceFiscale || !clientData || !stanza || !email}
      >
        Conferma Acquisto
      </Button>
    </Flex>
  );
}

export default CheckOut;

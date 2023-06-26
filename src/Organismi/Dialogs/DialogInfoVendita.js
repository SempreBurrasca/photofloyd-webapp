import React, { useEffect } from "react";
import { saveAs } from "file-saver";
import {
  Flex,
  View,
  Dialog,
  Button,
  ButtonGroup,
  Content,
  Divider,
  Header,
  Heading,
  Text,
  Tooltip,
  TooltipTrigger,
  Image,
  Well,
  Badge,
  ActionButton,
} from "@adobe/react-spectrum";
import { Timestamp } from "firebase/firestore";
import Print from "@spectrum-icons/workflow/Print";
import Mailbox from "@spectrum-icons/workflow/Mailbox";
import Portrait from "@spectrum-icons/workflow/Portrait";
import Landscape from "@spectrum-icons/workflow/Landscape";
import FullScreen from "@spectrum-icons/workflow/FullScreen";
import Data from "@spectrum-icons/workflow/Data";
import { updateSaleStatus } from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import Download from "@spectrum-icons/workflow/Download";
function DialogInfoVendita(props) {
  const { user, close, vendita } = props;

  useEffect(() => {console.log("Vendita =>",vendita)}, [vendita]);

  const formatDate = (data) => {
    const timestamp = new Timestamp(data.seconds, data.nanoseconds);
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };
  const checkIsSped = (arr) => {
    let check = false;
    arr.forEach((a) => {
      if (a.product.isSpedizione) {
        check = true;
      }
    });
    return check;
  };

  const handleDownload = async () => {
    const urls = vendita.fotoAcquistate;
    //Far scaricare oltre all'originale anche l'immagine da stampare
    for (const url of urls) {
      const response = await fetch(url.data.url);
      console.log(url);
      const blob = await response.blob();
      saveAs(blob, url.product.nome + "-" + url.id + ".jpg");
    }
  };

  return (
    <Dialog>
      <Heading>Dettaglio della vendita</Heading>
      <Header>
        {vendita.postazione} | {formatDate(vendita.data)}
      </Header>
      <Divider />
      <Content>
        <Flex gap={"size-100"} alignItems={"center"}>
          <Text>Report Vendita</Text>
          {checkIsSped(vendita.fotoAcquistate) && (
            <Badge
              variant={
                vendita.statusSpedizione === "Spedito" ? "positive" : "info"
              }
            >
              {vendita.statusSpedizione === "Spedito"
                ? "Spedito"
                : "Da Spedire"}
            </Badge>
          )}
        </Flex>
        <Flex gap={"size-250"}>
          <Flex direction="column" gap="size-100" flex={1}>
            <Heading level={4}>Ordine</Heading>
            {vendita.fotoAcquistate.map((ordine, index) => (
              <View key={ordine.id + "-" + makeId(5)} maxHeight={"400px"}>
                <Flex gap={"size-100"} alignItems={"center"}>
                  <span>{index + 1}</span>
                  <Flex gap={"size-100"}>
                    <Image src={ordine.data.url} height="50px" width="50px" />
                  </Flex>
                  <Flex direction={"column"} gap={"size-10"}>
                    <Flex gap={"size-50"}>
                      <Text>{ordine.id}</Text>
                    </Flex>
                    <Flex gap={"size-50"}>
                      <Text>{ordine.product.nome}</Text>
                      <Text>€{ordine.product.prezzo}</Text>
                    </Flex>
                    <Flex gap="size-100">
                      {ordine.product.isStampa ? (
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
                      {ordine.product.isStampa &&
                      ordine.product.orientation &&
                      ordine.product.orientation === "horizontal" ? (
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
                      {ordine.product.isStampa && ordine.product.fillCanvas && (
                        <TooltipTrigger>
                          <FullScreen size="S" />
                          <Tooltip>Cover Fit</Tooltip>
                        </TooltipTrigger>
                      )}
                      {ordine.product.isSpedizione && (
                        <TooltipTrigger>
                          <Mailbox size="S" />
                        </TooltipTrigger>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </View>
            ))}
            <ActionButton onPress={handleDownload}>
              <Download />
              Download Foto
            </ActionButton>
            <Divider size="S" />
            <Flex gap={"size-100"} alignSelf={"end"}>
              <Text>Totale: € {vendita.totale}</Text>
            </Flex>
          </Flex>
          <Divider size="M" orientation="vertical" />
          <Flex direction="column" gap="size-100" flex={1}>
            <Flex direction="column" gap="size-100">
              <Heading level={4}>Cliente</Heading>
              <Text>Nome: {vendita.cliente.nome}</Text>
              <Text>Telefono: {vendita.cliente.telefono}</Text>
              <Text>Email: {vendita.cliente.email}</Text>
              {checkIsSped(vendita.fotoAcquistate) &&
                vendita.statusSpedizione && (
                  <Flex direction={"column"} gap="size-100">
                    <Divider size="S" />
                    <Text>
                      Spedizione: {vendita.cliente.datiSpedizione.citta},
                      {vendita.cliente.datiSpedizione.indirizzo},
                      {vendita.cliente.datiSpedizione.cap}
                    </Text>
                    <Well>
                      Note di spedizione: {vendita.cliente.datiSpedizione.note}
                    </Well>
                    {vendita.cliente.id && (
                      <Text>ID utente :{vendita.cliente.id}</Text>
                    )}
                    <ActionButton
                      onPress={() => {
                        updateSaleStatus(vendita.id, "Spedito");
                      }}
                    >
                      Conferma avvenuta spedizione
                    </ActionButton>
                  </Flex>
                )}
            </Flex>
            <Divider size="M" />
            <Flex direction="column" gap="size-100">
              <Heading level={4}>Fotografo</Heading>
              <Text>
                {vendita.fotografo.displayName} - {vendita.fotografo.email}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Chiudi
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogInfoVendita;

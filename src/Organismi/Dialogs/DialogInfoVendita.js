import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  ActionButton,
  View,
  Checkbox,
  CheckboxGroup,
  TextField,
  DialogTrigger,
  Dialog,
  Button,
  ButtonGroup,
  Content,
  Divider,
  Header,
  Heading,
  Text,
  Switch,
  Image,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import Search from "@spectrum-icons/workflow/Search";
import {
  getAllPostazioni,
  updateUser,
} from "../../Functions/firebaseFunctions";
import { Timestamp } from "firebase/firestore";

function DialogInfoVendita(props) {
  const navigate = useNavigate();
  const { user, close, vendita } = props;

  useEffect(() => {
    console.log(vendita);
  }, [vendita]);

  const formatDate = (data) => {
    const timestamp = new Timestamp(data.seconds, data.nanoseconds);
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  return (
    <Dialog>
      <Heading>Dettaglio della vendita</Heading>
      <Header>
        {vendita.postazione} | {formatDate(vendita.data)}
      </Header>
      <Divider />
      <Content>
        <Text>Report Vendita</Text>
        <Flex gap={"size-250"}>
          <Flex direction="column" gap="size-100" flex={3}>
            <Heading level={4}>Ordine</Heading>
            {vendita.fotoAcquistate.map((ordine) => (
              <View key={ordine.id} maxHeight={"400px"}>
              <Flex gap={"size-100"}  alignItems={"center"}>
                <Flex gap={"size-100"}>
                  <Image src={ordine.data.url} height="50px" width="50px" />
                </Flex>
                <Flex direction={"column"} gap={"size-100"}>
                  <Flex gap={"size-50"}>
                    <Text>{ordine.id}</Text>
                  </Flex>
                  <Flex gap={"size-50"}>
                    <Text>{ordine.product.nome}</Text>
                    <Text>€{ordine.product.prezzo}</Text>
                  </Flex>
                </Flex>
              </Flex>
              </View>
            ))}
            <Divider size="S" />
            <Flex gap={"size-100"} alignSelf={"end"}>
              <Text>Totale: € {vendita.totale}</Text>
            </Flex>
          </Flex>
          <Divider size="M" orientation="vertical" />
          <Flex direction="column" gap="size-100" flex={1}>
            <Flex direction="column" gap="size-100">
              <Heading level={4}>Cliente</Heading>
              <Text>
                {vendita.cliente.nome} - {vendita.cliente.cognome}
              </Text>
              <Text>{vendita.cliente.codiceFiscale}</Text>
              <Text>{vendita.cliente.email}</Text>
              {vendita.cliente.id && (
                <Text>ID utente :{vendita.cliente.id}</Text>
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

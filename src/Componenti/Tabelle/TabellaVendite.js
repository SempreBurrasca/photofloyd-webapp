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
  TextField,
  DialogTrigger,
  Dialog,
  Button,
  ButtonGroup,
  Content,
  Divider,
  Header,
  Heading,
  Well,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import Search from "@spectrum-icons/workflow/Search";
import DialogEditUser from "../../Organismi/Dialogs/DialogEditUser";
import { makeId } from "../../Functions/logicArray";
import Info from "@spectrum-icons/workflow/Info";
import DialogInfoVendita from "../../Organismi/Dialogs/DialogInfoVendita";
import { Timestamp } from "firebase/firestore";
function TabellaVendite(props) {
  const navigate = useNavigate();
  const { vendite } = props;
  const [search, setSearch] = React.useState();
  const [filteredVendite,setFilteredVendite]=React.useState(vendite)

  useEffect(()=>{
    if(search&&search.length>3){
      const filteredVendite = vendite.filter((vendita) => {
        const postazioneMatch = vendita.postazione.toLowerCase()
        .includes(search.toLowerCase());
        const emailMatch = vendita.cliente.email
          .toLowerCase()
          .includes(search.toLowerCase());
          const clienteMatch = vendita.cliente.name
          .toLowerCase()
          .includes(search.toLowerCase());
          const fotografoMatch = vendita.fotografo.displayName
          .toLowerCase()
          .includes(search.toLowerCase());
          const idMatch = vendita.id
          .toLowerCase()
          .includes(search.toLowerCase());
        return postazioneMatch || emailMatch || clienteMatch || fotografoMatch || idMatch;
      });
      setFilteredVendite(filteredVendite);
    }
  },[search,vendite])

  const formatDate = (data) => {
    const timestamp = new Timestamp(data.seconds, data.nanoseconds);
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };
  return (
    <Flex
      direction={"column"}
      alignItems="center"
      gap={"size-200"}
      width={"90%"}
    >
      <TextField
        label="Ricerca"
        icon={<Search />}
        width="80vw"
        value={search}
        onChange={setSearch}
      />
      {vendite.length > 0 ? (
        <TableView
          height="100%"
          width={"100%"}
          aria-label="Example table with static contents"
        >
          <TableHeader>
            <Column allowsResizing align="end" width={100}>
              Data
            </Column>
            <Column allowsResizing align="start">
              ID
            </Column>
            <Column allowsResizing align="start">
              Postazione
            </Column>

            <Column allowsResizing align="start">
              Cliente
            </Column>
            <Column allowsResizing align="start">
              Fotografo
            </Column>
            <Column allowsResizing align="end">
              Totale
            </Column>
            <Column allowsResizing align="end">
              Vedi
            </Column>
          </TableHeader>
          <TableBody>
            {filteredVendite.map((vendita) => (
              <Row key={makeId(4) + "-" + vendita.id}>
                <Cell align="end">{formatDate(vendita.data)}</Cell>
                <Cell align="start">{vendita.id}</Cell>
                <Cell align="start">{vendita.postazione}</Cell>

                <Cell align="start">{vendita.cliente.name}</Cell>
                <Cell align="start">{vendita.fotografo.displayName}</Cell>
                <Cell align="start">€{vendita.totale}</Cell>
                <Cell>
                  <DialogTrigger>
                    <ActionButton>
                      <Info />
                    </ActionButton>
                    {(close) => (
                      <DialogInfoVendita vendita={vendita} close={close} />
                    )}
                  </DialogTrigger>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      ) : (
        <Well>
          Non sono ancora state effettuate vendite in questa postazione
        </Well>
      )}
    </Flex>
  );
}

export default TabellaVendite;

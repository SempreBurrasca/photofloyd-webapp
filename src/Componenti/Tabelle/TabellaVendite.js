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
  DateRangePicker,
  Badge,
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
  const [filteredVendite, setFilteredVendite] = React.useState(vendite);
  const [dateRange, setDateRange] = React.useState();

  useEffect(() => {
    if (search || (dateRange && filteredVendite)) {
      const filteredVendite_ = filteredVendite.filter((vendita) => {
        if (search) {
          const postazioneMatch = vendita.postazione
            .toLowerCase()
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
          const spedMatch = vendita.statusSpedizione
            ? vendita.statusSpedizione
                .toLowerCase()
                .includes(search.toLowerCase())
            : false;

          return (
            postazioneMatch ||
            emailMatch ||
            clienteMatch ||
            fotografoMatch ||
            idMatch ||
            spedMatch
          );
        }
        if (dateRange) {
          function convertDate(obj) {
            const day = obj.day;
            const month = obj.month;
            const year = obj.year;

            return `${day}/${month}/${year}`;
          }
          const dateVendita = new Date(
            vendita.data.seconds * 1000 + vendita.data.nanoseconds / 1000000
          );
          let dateMatch =
            dateVendita >= new Date(convertDate(dateRange.start)) &&
            dateVendita <= new Date(convertDate(dateRange.end));
          console.log(
            dateVendita,
            new Date(convertDate(dateRange.start)),
            new Date(convertDate(dateRange.end))
          );
          return dateMatch;
        }
      });
      setFilteredVendite(filteredVendite_);
    } else {
      setFilteredVendite(vendite);
    }
  }, [search, vendite, dateRange]);
  const totalOfVendite = () => {
    let totale = 0;
    filteredVendite.forEach((v) => {
      console.log(v.totale);
      totale += parseFloat(v.totale||v.totalePagato);
    });
    return totale.toFixed(2);
  };
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
  return (
    <Flex
      direction={"column"}
      alignItems="center"
      gap={"size-200"}
      width={"90%"}
    >
      <Flex gap="size-100" width={"100%"}>
        <TextField
          label="Ricerca"
          icon={<Search />}
          flex={2}
          value={search}
          onChange={setSearch}
        />
        <DateRangePicker
          label="Ricerca per data"
          flex={1}
          value={dateRange}
          onChange={setDateRange}
          shouldFlip
        />
      </Flex>
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
            <Column allowsResizing align="center">
              Spedizione
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
                <Cell align="start">€{vendita.totale||vendita.totalePagato}</Cell>
                <Cell align="center">
                  {checkIsSped(vendita.fotoAcquistate) ? (
                    <Badge
                      variant={
                        vendita.statusSpedizione === "Spedito"
                          ? "positive"
                          : "info"
                      }
                    >
                      {vendita.statusSpedizione === "Spedito"
                        ? "Spedito"
                        : "Da Spedire"}
                    </Badge>
                  ) : (
                    "No Spedizione"
                  )}
                </Cell>
                <Cell>
                  <Flex gap="size-100">
                    <DialogTrigger>
                      <ActionButton>
                        <Info />
                      </ActionButton>
                      {(close) => (
                        <DialogInfoVendita vendita={vendita} close={close} />
                      )}
                    </DialogTrigger>
                  </Flex>
                </Cell>
              </Row>
            ))}
            <Row>
              <Cell align="end"></Cell>
              <Cell align="start"></Cell>
              <Cell align="start"></Cell>
              <Cell align="start"></Cell>
              <Cell align="start"></Cell>

              <Cell align="start">€{totalOfVendite()}</Cell>
              <Cell align="start"></Cell>
              <Cell></Cell>
            </Row>
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

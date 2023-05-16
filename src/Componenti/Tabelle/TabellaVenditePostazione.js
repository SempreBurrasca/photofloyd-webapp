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
function TabellaVenditePostazione(props) {
  const navigate = useNavigate();
  const { vendite } = props;
  useEffect(() => {
    console.log(vendite);
  }, [vendite]);
  return (
    <Flex direction={"column"} alignItems="center" gap={"size-200"}>
      {vendite.length > 0 ? (
        <TableView
          height="100%"
          width={"100%"}
          aria-label="Example table with static contents"
        >
          <TableHeader>
            <Column allowsResizing align="start">
              ID
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
            {vendite.map((vendita) => (
              <Row key={makeId(4) + "-" + vendita.id}>
                <Cell align="start">{vendita.id}</Cell>
                <Cell align="start">{vendita.cliente.name}</Cell>
                <Cell align="start">{vendita.fotografo.displayName}</Cell>
                <Cell align="start">€{vendita.totale}</Cell>
                <Cell>
                  <DialogTrigger>
                    <ActionButton>
                      <Info />
                    </ActionButton>
                    {(close) => <DialogEditUser user={vendita} close={close} />}
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

export default TabellaVenditePostazione;

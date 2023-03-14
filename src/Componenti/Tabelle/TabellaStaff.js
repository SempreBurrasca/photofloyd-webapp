import React from "react";
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
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import Search from "@spectrum-icons/workflow/Search";

function TabellaStaff(props) {
  const navigate = useNavigate();

  return (
    <Flex

      height="100%"
      width="90vw"
      direction={"column"}
      alignItems="center"
      gap={"size-200"}
    >
      <TextField label="Ricerca" icon={<Search/>} width="80vw"/>
      <TableView
        height="100%"
        width="80vw"
        aria-label="Example table with static contents"
      >
        <TableHeader>
          <Column align="start">Nome</Column>
          <Column align="start">Ruolo</Column>
          <Column align="end">Modifica</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell align="start">Games</Cell>
            <Cell align="start">File folder</Cell>
            <Cell>
              <ActionButton>
                <Edit />
              </ActionButton>
            </Cell>
          </Row>
          <Row>
            <Cell align="start">Program Files</Cell>
            <Cell align="start">File folder</Cell>
            <Cell>
              <ActionButton>
                <Edit />
              </ActionButton>
            </Cell>
          </Row>
          <Row>
            <Cell align="start">bootmgr</Cell>
            <Cell align="start">System file</Cell>
            <Cell>
              <ActionButton>
                <Edit />
              </ActionButton>
            </Cell>
          </Row>
          <Row>
            <Cell align="start">log.txt</Cell>
            <Cell align="start">Text Document</Cell>
            <Cell>
              <ActionButton>
                <Edit />
              </ActionButton>
            </Cell>
          </Row>
        </TableBody>
      </TableView>
    </Flex>
  );
}

export default TabellaStaff;

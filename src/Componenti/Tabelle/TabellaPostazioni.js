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
  TextField,
  Item,
} from "@adobe/react-spectrum";
import Search from "@spectrum-icons/workflow/Search";
import OpenIn from "@spectrum-icons/workflow/OpenIn";
import { TagGroup } from "@react-spectrum/tag";
import { makeId } from "../../Functions/logicArray";
function TabellaPostazioni(props) {
  const navigate = useNavigate();

  return (
    <Flex
      height="100%"
      width="90vw"
      direction={"column"}
      alignItems="center"
      gap={"size-200"}
    >
      <TextField label="Ricerca" icon={<Search />} isDisabled width="80vw" />
      <TableView
        height="100%"
        width="80vw"
        aria-label="Example table with static contents"
      >
        <TableHeader>
          <Column align="start">Postazione</Column>
          <Column align="start">Tag</Column>
          <Column align="end"> </Column>
        </TableHeader>
        <TableBody>
          {props.postazioni.map((postazione) => (
            <Row key={makeId(4) + "-" + postazione.id}>
              <Cell align="start">{postazione.name}</Cell>
              <Cell align="start">
                <TagGroup
                  items={postazione.tag}
                  aria-label="Tag del progetto"
                >
                  {(item, index) => (
                    <Item key={item.id + "-" + makeId(3)}>{item.name}</Item>
                  )}
                </TagGroup>
              </Cell>
              <Cell>
                <ActionButton
                  onPress={() => navigate("/postazione/" + postazione.id)}
                >
                  <OpenIn />
                </ActionButton>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Flex>
  );
}

export default TabellaPostazioni;

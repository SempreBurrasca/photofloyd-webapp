import React, { useEffect, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [postazioni, setPostazioni] = useState(props.postazioni);

  useEffect(() => {
    const filteredPostazioni = props.postazioni.filter((postazione) => {
      // Check if postazione name includes search value
      const nameMatch = postazione.name
        .toLowerCase()
        .includes(search.toLowerCase());
      // Check if any of the postazione tags include search value
      const tagMatch = postazione.tag.some((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase())
      );
      return nameMatch || tagMatch;
    });
    setPostazioni(filteredPostazioni);
  }, [search, props.postazioni]);

  return (
    <Flex
      height="100%"
      width="90vw"
      direction={"column"}
      alignItems="center"
      gap={"size-200"}
    >
      <TextField
        label="Ricerca"
        icon={<Search />}
        width="80vw"
        value={search}
        onChange={setSearch}
      />
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
          {postazioni.map((postazione) => (
            <Row key={makeId(4) + "-" + postazione.id}>
              <Cell align="start">{postazione.name}</Cell>
              <Cell align="start">
                <TagGroup items={postazione.tag} aria-label="Tag del progetto">
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

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
  DialogTrigger,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import Search from "@spectrum-icons/workflow/Search";
import DialogEditUser from "../../Organismi/Dialogs/DialogEditUser";
import { makeId } from "../../Functions/logicArray";
function TabellaStaff(props) {
  const navigate = useNavigate();
  const { staff } = props;
  const [search, setSearch] = React.useState("");

  const [filteredStaff, setFilteredStaff] = React.useState(staff);

  React.useEffect(() => {
    const filteredStaff = staff.filter((user) => {
      // Check if user displayName or email includes search value
      const displayNameMatch = user.displayName
        .toLowerCase()
        .includes(search.toLowerCase());
      const emailMatch = user.email
        .toLowerCase()
        .includes(search.toLowerCase());
      return displayNameMatch || emailMatch;
    });
    setFilteredStaff(filteredStaff);
  }, [search, staff]);
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
          <Column align="start">Nome</Column>
          <Column align="start">Ruolo</Column>
          <Column align="end">Modifica</Column>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((user) => (
            <Row key={makeId(4) + "-" + user.uid}>
              <Cell align="start">
                {user.displayName ? user.displayName : user.email}
              </Cell>
              <Cell align="start">{user.ruolo ? user.ruolo : "---"}</Cell>
              <Cell>
                <DialogTrigger>
                  <ActionButton>
                    <Edit />
                  </ActionButton>
                  {(close) => <DialogEditUser user={user} close={close} />}
                </DialogTrigger>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Flex>
  );
}

export default TabellaStaff;

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
  RadioGroup,
  Radio,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import Search from "@spectrum-icons/workflow/Search";
import {
  getAllPostazioni,
  updateUser,
} from "../../Functions/firebaseFunctions";

function DialogEditUser(props) {
  const navigate = useNavigate();
  const { user, close } = props;
  const [postazioni, setPostazioni] = React.useState([]);
  const [selected, setSelected] = React.useState(user.postazioni);
  const [nome, setNome] = React.useState(user.displayName);
  const [ruolo, setRuolo] = React.useState(user.ruolo);
  const [permessi0, setPermessi0] = React.useState(user.permessi[0]);
  const [permessi1, setPermessi1] = React.useState(user.permessi[1]);
  const [permessi2, setPermessi2] = React.useState(user.permessi[2]);
  const [permessi3, setPermessi3] = React.useState(user.permessi[3]);
  const [permessi4, setPermessi4] = React.useState(user.permessi[4]);
  useEffect(() => {
    getAllPostazioni().then((_postazioni) => {
      setPostazioni(_postazioni);
    });
  }, []);

  const handleSave = () => {
    let newData = {
      displayName: nome,
      ruolo: ruolo,
      email: user.email,
      postazioni: selected,
    };
    updateUser(user.uid, newData, selected);
    close();
  };
  return (
    <Dialog>
      <Heading>
        Modifica utente {user.displayName ? user.displayName : user.email}
      </Heading>
      <Header>Connection status: Connected</Header>
      <Divider />
      <Content>
        <Flex direction={"column"} gap={"size-200"}>
          <TextField
            label="Nome"
            width={"100%"}
            value={nome}
            onChange={setNome}
          />
          <RadioGroup label="Ruolo" value={ruolo} onChange={setRuolo}>
            <Radio  value="Admin">
              Admin
            </Radio>
            <Radio value="Responsabile">
              Responsabile
            </Radio>
            <Radio value="Fotografo">
              Fotografo
            </Radio>
          </RadioGroup>
          <CheckboxGroup
            label="Postazioni"
            value={selected}
            onChange={setSelected}
          >
            {postazioni.map((postazione) => (
              <Checkbox key={postazione.id} value={postazione.id}>
                {postazione.name}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Chiudi
        </Button>
        <Button variant="cta" onPress={handleSave}>
          Salva
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogEditUser;

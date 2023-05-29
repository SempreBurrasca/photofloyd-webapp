import React, { useState } from "react";
import {
  ActionButton,
  ActionGroup,
  DialogTrigger,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  TabList,
  Tabs,
  View,
  Content,
  Dialog,
  Divider,
  Heading,
  Button,
  ButtonGroup,
  Header,
  Text,
  TextField,
  DialogContainer,
  AlertDialog,
  ProgressCircle,
} from "@adobe/react-spectrum";
import { Avatar } from "@react-spectrum/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectAdd from "@spectrum-icons/workflow/ProjectAdd";
import { getAuth } from "firebase/auth";
import CreatePostazioneButton from "../Pulsanti/CreatePostazioneButton";
import CreateUserButton from "../Pulsanti/CreateUserButton";
import { key } from "localforage";
function HeaderPhotofloyd(props) {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const handleAction = (key) => {
    if (key === "profilo") {
      navigate(key);
    } else {
      auth.signOut();
      navigate("/");
    }
  };

  const getSelectedTabKey = () => {
    const path = location.pathname;
    if (path.startsWith("/staff")) {
      return "staff";
    } else if (path.startsWith("/finanze")) {
      return "finanze";
    } else if (path.startsWith("/impostazioni")) {
      return "impostazioni";
    } else if (path.startsWith("/aiuto")) {
      return "aiuto";
    } else {
      return "";
    }
  };
  return (
    <Flex minHeight="size-675" gap="size-400" alignItems={"center"}>
      <View
        flex={1}
        paddingTop="size-200"
        paddingBottom="size-200"
        paddingStart="size-800"
      >
        <Flex
          direction="row"
          gap="size-400"
          justifyContent="start"
          alignItems={"center"}
        >
          <View>
            <h3>Photofloyd</h3>
          </View>
          <View>
            {/*AGGIUNGERE FUNZIONE CHE RENDE ATTIVA LA TAB IN BASE ALLA ROUTE*/}
            <Tabs
              aria-label="Menu della dashboard generale"
              isEmphasized
              onSelectionChange={(key) => navigate("/" + key)}
              defaultSelectedKey={getSelectedTabKey()}
            >
              <TabList>
                <Item key="">Postazioni</Item>
                <Item key="staff">Staff</Item>
                <Item key="finanze">Finanze</Item>
                <Item key="impostazioni">Impostazioni</Item>
                <Item key="aiuto">Aiuto</Item>
              </TabList>
            </Tabs>
          </View>
        </Flex>
      </View>
      <View
        flex={1}
        paddingTop="size-200"
        paddingBottom="size-200"
        paddingEnd="size-800"
      >
        <Flex
          direction="row"
          gap="size-400"
          justifyContent="end"
          alignItems={"center"}
        >
          <View>
            <CreatePostazioneButton db={props.db} />
            <CreateUserButton db={props.db} />
          </View>
          <View>
            <MenuTrigger>
              <ActionButton>
                <Avatar
                  src="https://i.imgur.com/kJOwAdv.png"
                  alt="default Adobe avatar"
                  size="avatar-size-700"
                />
              </ActionButton>
              <Menu onAction={handleAction}>
                <Item key="profilo">Profilo</Item>
                <Item key="logout">Logout</Item>
              </Menu>
            </MenuTrigger>
          </View>
        </Flex>
      </View>
    </Flex>
  );
}

export default HeaderPhotofloyd;

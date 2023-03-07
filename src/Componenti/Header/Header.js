import React from "react";
import {
  ActionButton,
  ActionGroup,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  TabList,
  Tabs,
  View,
} from "@adobe/react-spectrum";
import { Avatar } from "@react-spectrum/avatar";
import { useNavigate } from "react-router-dom";

function Header(props) {
    const navigate = useNavigate()
  return (
    <Flex minHeight="size-675" gap="size-400" alignItems={"center"}>
      <View flex={1} paddingTop="size-200" paddingBottom="size-200" paddingStart="size-800">
        <Flex
          direction="row"
          gap="size-400"
          justifyContent="start"
          alignItems={"center"}
        >
          <View >
            <h3>Photofloyd</h3>
          </View>
          <View >
            <Tabs
              aria-label="Menu della dashboard generale"
              isEmphasized
              onSelectionChange={(key) => navigate(key)}
              defaultSelectedKey="postazioni"
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
      <View flex={1} paddingTop="size-200" paddingBottom="size-200" paddingEnd="size-800">
        <Flex
          direction="row"
          gap="size-400"
          justifyContent="end"
          alignItems={"center"}
        >
          <View justifySelf="end">
            <ActionGroup onAction={(key) => console.log(key)}>
              <Item key="add">Add</Item>
              <Item key="delete">Delete</Item>
            </ActionGroup>
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
              <Menu onAction={(key) => alert(key)}>
                <Item key="cut">Cut</Item>
                <Item key="copy">Copy</Item>
                <Item key="paste">Paste</Item>
                <Item key="replace">Replace</Item>
              </Menu>
            </MenuTrigger>
          </View>
        </Flex>
      </View>
    </Flex>
  );
}

export default Header;

import { Divider, Flex } from "@adobe/react-spectrum";
import React from "react";
import HeaderPhotofloyd from "../Componenti/Header/Header";

function LayoutConHeader(props) {
  return (
    <Flex direction="column" minHeight="100vh" gap="size-100">
      <HeaderPhotofloyd />
      <Divider size="M" />
      {props.children}
    </Flex>
  );
}

export default LayoutConHeader;

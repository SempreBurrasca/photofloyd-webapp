import { Divider, Flex, View } from "@adobe/react-spectrum";
import React from "react";
import HeaderPhotofloyd from "../Componenti/Header/Header";

function LayoutConHeader(props) {
  return (
    <View backgroundColor="gray-200">
      <Flex direction="column" minHeight="100vh" maxHeight="100vh" gap="size-100">
        <HeaderPhotofloyd db={props.db} />
        <Divider size="M" />
        {props.children}
      </Flex>
    </View>
  );
}

export default LayoutConHeader;

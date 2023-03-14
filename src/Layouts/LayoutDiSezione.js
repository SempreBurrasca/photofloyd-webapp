import { Divider, Flex,View } from "@adobe/react-spectrum";
import React from "react";
import Header from "../Componenti/Header/Header";
import HeaderSezioneInterna from "../Componenti/Header/HeaderSezioneInterna";

function LayoutDiSezione(props) {
  return (
    <Flex direction="column" minHeight="100vh" gap="size-100">
      <HeaderSezioneInterna />
      <Divider size="M" />
      <View padding="size-600">
      {props.children}
      </View>
    </Flex>
  );
}

export default LayoutDiSezione;

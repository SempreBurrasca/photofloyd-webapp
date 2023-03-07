import { Divider, Flex } from "@adobe/react-spectrum";
import React from "react";
import Header from "../Componenti/Header/Header";
import HeaderSezioneInterna from "../Componenti/Header/HeaderSezioneInterna";

function LayoutDiSezione(props) {
  return (
    <Flex direction="column" minHeight="100vh" gap="size-100">
      <HeaderSezioneInterna />
      <Divider size="M" />
      {props.children}
    </Flex>
  );
}

export default LayoutDiSezione;

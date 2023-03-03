import { Flex } from "@adobe/react-spectrum";
import React from "react";

function LayoutCentratoAlloSchermo(props) {
  return (
    <Flex
      direction="column"
      minHeight="100vh"
      gap="size-100"
      alignItems="center"
      justifyContent="center"
    >
      {props.children}
    </Flex>
  );
}

export default LayoutCentratoAlloSchermo;

import React, { useState, useEffect, useContext } from "react";
import { Flex, Heading } from "@adobe/react-spectrum";
import { StateContext } from "../../Context/stateContext";

function ClientView(props) {
  const { state, dispatch } = useContext(StateContext);

  React.useEffect(() => {}, []);

  return (
    <Flex
      direction={"column"}
      gap={"size-125"}
      height="100vh"
      maxHeight={"100vh"}
      overflow={"hidden"}
    >
      <Heading level={3}>Client View</Heading>
    </Flex>
  );
}

export default React.memo(ClientView);

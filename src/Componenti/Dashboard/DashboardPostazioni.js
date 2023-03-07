import React from "react";
import { Flex, Heading, Well } from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";

function DashboardPostazioni(props) {
  const navigate = useNavigate();
  return (
    <Flex direction={"column"} minHeight="100vh" alignItems={"center"}>
      <Heading level={3}>
        Ciao [username], seleziona la postazione dalla quale lavorare.
      </Heading>
    </Flex>
  );
}

export default DashboardPostazioni;

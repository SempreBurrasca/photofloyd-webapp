import React from "react";
import { Flex } from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";

function DashboardAiuto(props) {
  const navigate = useNavigate();
  return (
    <Flex direction={"column"} minHeight="100vh" alignItems={"center"}>
      <h1>Aiuto</h1>
      <h1>Aiuto</h1>
    </Flex>
  );
}

export default DashboardAiuto;

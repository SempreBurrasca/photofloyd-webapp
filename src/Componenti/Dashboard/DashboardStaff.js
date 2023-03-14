import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import TabellaStaff from "../Tabelle/TabellaStaff";

function DashboardStaff(props) {
  const navigate = useNavigate();
  return (
    <Flex direction={"column"} minHeight="100vh" alignItems={"center"}>
      <TabellaStaff />
    </Flex>
  );
}

export default DashboardStaff;

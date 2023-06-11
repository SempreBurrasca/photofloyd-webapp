import React, { useEffect, useState } from "react";
import { Flex, View } from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import TabellaStaff from "../Tabelle/TabellaStaff";
import { getUsers } from "../../Functions/firebaseFunctions";

function DashboardStaff(props) {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    getUsers().then((res) => {
      setStaff(res);
    });
  }, []);
  return (
    <Flex direction={"column"} minHeight="100vh" alignItems={"center"}>
      <TabellaStaff staff={staff} />
    </Flex>
  );
}

export default DashboardStaff;

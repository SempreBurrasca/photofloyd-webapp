import React, { useEffect, useState } from "react";
import { Flex, Well } from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import { getAllSales } from "../../Functions/firebaseGetFunctions";
import TabellaVendite from "../Tabelle/TabellaVendite";

function DashboardFinanze(props) {
  const navigate = useNavigate();
  const [vendite, setVendite] = useState([]);
  useEffect(() => {
    getAllSales(setVendite);
  }, []);
  return (
    <Flex
      direction={"column"}
      minHeight="100vh"
      width="100%"
      alignItems={"center"}
    >
      <h1>Report di vendite</h1>
      {vendite.length > 0 ? (
        <TabellaVendite vendite={vendite} />
      ) : (
        <Well>Non sono ancora state effettuate vendite</Well>
      )}
    </Flex>
  );
}

export default DashboardFinanze;

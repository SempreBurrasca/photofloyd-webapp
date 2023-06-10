import React, { useState, useEffect, useContext } from "react";
import {
  Flex,
  Heading,
  DateRangePicker,
} from "@adobe/react-spectrum";

import { StateContext } from "../../Context/stateContext";

function DataFilter(props) {
  const { state, dispatch } = useContext(StateContext);

  const [date, setDate] = React.useState(false);

  useEffect(() => {
    if (date) {
      dispatch({
        type: "SET_FILTER_DATA",
        data: date,
      });
    } else {
      dispatch({
        type: "SET_FILTER_DATA",
        data: false,
      });
    }
  }, [date]);

  const handleSelection = (e) => {
    setDate(e);
  };

  return (
    <Flex direction={"column"} gap={"size-100"} alignItems={"start"}>
      <Heading level={5} margin={0}>
        Filtra per range di date
      </Heading>
      <DateRangePicker
        width="100%"
        value={date}
        onChange={handleSelection}
        shouldFlip
      />
    </Flex>
  );
}

export default DataFilter;

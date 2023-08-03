import React, { useState, useEffect } from "react";
import { ComboBox, TextField, DatePicker, Item } from "@adobe/react-spectrum";
import { getClienti } from "../../Functions/firebaseGetFunctions";

function RicercaCliente({ db, postazioneId, setSelectedClient }) {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [searchDateRange, setSearchDateRange] = useState(null);

  useEffect(() => {
    getClienti(db, postazioneId, setClients);
  }, [db, postazioneId]);

  const handleSelection = (e) => {
    setSelectedClients([e]);
    setSelectedClient([e]);
  };

  const filteredClients = clients.filter((client) => {
    const clientStartDate = client.data.data
      ? client.data.data.start.toDate()
      : null;
    const clientEndDate = client.data.data
      ? client.data.data.end.toDate()
      : null;
    if (
      searchText !== "" &&
      !client.id.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false;
    }

    if (roomNumber !== "" && client.data.stanza !== roomNumber) {
      return false;
    }

    if (searchDateRange) {
      const searchDate = new Date(
        searchDateRange.year,
        searchDateRange.month - 1,
        searchDateRange.day
      );
      if (searchDate < clientStartDate || searchDate > clientEndDate) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <ComboBox
        defaultItems={filteredClients}
        onSelectionChange={handleSelection}
        width={"100%"}
      >
        {(item) => <Item key={item.id}>{item.id}</Item>}
      </ComboBox>
      <TextField
        label="Cerca per nome cliente"
        value={searchText}
        onChange={setSearchText}
      />
      <TextField
        label="Numero Stanza"
        value={roomNumber}
        onChange={setRoomNumber}
      />
      <DatePicker
        label="Cerca per data"
        value={searchDateRange}
        onChange={setSearchDateRange}
      />
    </div>
  );
}

export default RicercaCliente;

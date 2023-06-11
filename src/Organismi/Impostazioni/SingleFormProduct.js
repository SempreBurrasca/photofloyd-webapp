import React, { useEffect } from "react";
import {
  ActionButton,
  ComboBox,
  Divider,
  Flex,
  Heading,
  Item,
  NumberField,
  Switch,
  Text,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { useNavigate } from "react-router-dom";
import {
  getTagsFromFirebase,
  saveProductToFirebase,
  saveTagsToFirebase,
} from "../../Functions/firebaseFunctions";
import { makeId } from "../../Functions/logicArray";
import SaveAsFloppy from "@spectrum-icons/workflow/SaveAsFloppy";

function SingleFormProduct(props) {
  const { prodotti } = props;
  const [prodotto, setProdotto] = React.useState(props.prodotto);
  React.useEffect(() => {}, [prodotto]);
  return (
    <Flex
      direction={"column"}
      gap={"size-100"}
      alignItems={"start"}
      width={"100%"}
      justifyContent={"space-around"}
    >
      <Flex width={"100%"} justifyContent={"center"}>
        <TextField
          label="Nome"
          width={"100%"}
          value={prodotto.nome}
          onChange={(e) => setProdotto({ ...prodotto, nome: e })}
        />
      </Flex>
      <TextField
        label="Descrizione"
        width={"100%"}
        value={prodotto.descrizione}
        onChange={(e) => setProdotto({ ...prodotto, descrizione: e })}
      />
      <Flex
        width={"100%"}
        justifyContent={"start"}
        gap="size-125"
        alignItems={"center"}
      >
        <Switch
          isSelected={prodotto.isStampa}
          flexGrow={0.5}
          onChange={(e) =>
            setProdotto({
              ...prodotto,
              isStampa: prodotto.isStampa ? false : true,
            })
          }
        >
          Prodotto di stampa
        </Switch>
        {prodotto.isStampa && (
          <Flex
            flex={1}
            justifyContent={"start"}
            gap="size-125"
            alignItems={"center"}
          >
            <NumberField
              label="Width"
              flex={1}
              value={prodotto.width}
              onChange={(e) => setProdotto({ ...prodotto, width: e })}
              minValue={0}
            />
            <NumberField
              label="Height"
              flex={1}
              value={prodotto.height}
              onChange={(e) => setProdotto({ ...prodotto, height: e })}
              minValue={0}
            />
            <ComboBox
              label="Unità di misura"
              flex={0.5}
              onSelectionChange={(selected) =>
                setProdotto({ ...prodotto, misura: selected })
              }
            >
              <Item key="cm">cm</Item>
              <Item key="px">px</Item>
            </ComboBox>
          </Flex>
        )}
      </Flex>
      <Flex
        width={"100%"}
        justifyContent={"start"}
        gap="size-125"
        alignItems={"center"}
      >
        <Switch
          flex={0.5}
          isSelected={prodotto.isSpedizione}
          onChange={(e) =>
            setProdotto({
              ...prodotto,
              isSpedizione: prodotto.isSpedizione ? false : true,
            })
          }
        >
          Da Spedire
        </Switch>
        {prodotto.isSpedizione && (
          <NumberField
            flex={1}
            label="Costo Spedizione"
            value={prodotto.costoSpedizione}
            formatOptions={{
              style: "currency",
              currency: "EUR",
              currencyDisplay: "code",
              currencySign: "accounting",
            }}
            onChange={(e) => setProdotto({ ...prodotto, costoSpedizione: e })}
          />
        )}
      </Flex>
      <NumberField
        width={"100%"}
        label="Prezzo"
        value={prodotto.prezzo}
        formatOptions={{
          style: "currency",
          currency: "EUR",
          currencyDisplay: "code",
          currencySign: "accounting",
        }}
        onChange={(e) => setProdotto({ ...prodotto, prezzo: e })}
      />
      <ActionButton
        width={"100%"}
        onPress={() => {
          saveProductToFirebase(props.db, prodotto);
        }}
      >
        <SaveAsFloppy />
        Salva Prodotto
      </ActionButton>
      <Divider size="M" marginTop={"size-150"}/>
    </Flex>
  );
}

export default SingleFormProduct;

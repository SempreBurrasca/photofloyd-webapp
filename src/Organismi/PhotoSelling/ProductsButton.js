import React, { useState, useEffect } from "react";
import {

  ActionGroup,
  Item,
  Text,
  View,

} from "@adobe/react-spectrum";

function ProductsButton(props) {
  const { activeFoto, setActiveFoto, setProductIsSelected } = props;
  const handleAction = (key) => {
    setProductIsSelected(true);
    setActiveFoto({
      ...activeFoto,
      product: getProductById(props.prodotti, key),
    });
    console.log(getProductById(props.prodotti, key));
  };
  const getProductById = (products, id) => {
    return products.find((product) => product.id === id);
  };

  return (
    <View overflow={"auto"} minHeight={"300px"} padding={"size-100"}>
      <ActionGroup
        width={"size-3000"}
        aria-label="Text alignment"
        overflowMode="wrap"
        selectionMode="single"
        disallowEmptySelection
        orientation="vertical"
        isEmphasized
        density="compact"
        isJustified
        onAction={handleAction}
      >
        {props.prodotti.map((prodotto) => (
          <Item key={prodotto.id}>
            <Text>{prodotto.nome}</Text>
          </Item>
        ))}
      </ActionGroup>
    </View>
  );
}

export default ProductsButton;

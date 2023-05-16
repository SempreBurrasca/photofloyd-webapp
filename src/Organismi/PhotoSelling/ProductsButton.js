import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import LayoutConHeader from "../../Layouts/LayoutConHeader";
import {
  ActionButton,
  ActionGroup,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Grid,
  Header,
  Heading,
  Image,
  Item,
  Menu,
  MenuTrigger,
  TabList,
  TabPanels,
  Tabs,
  Text,
  TextField,
  View,
  Well,
} from "@adobe/react-spectrum";

import ShoppingCart from "@spectrum-icons/workflow/ShoppingCart";
import Visibility from "@spectrum-icons/workflow/Visibility";
import ImageAutoMode from "@spectrum-icons/workflow/ImageAutoMode";

function ProductsButton(props) {
  const { activeFoto, setActiveFoto,setProductIsSelected } = props;
  const handleAction = (key) => {
    setProductIsSelected(true);
    setActiveFoto({
      ...activeFoto,
      product: getProductById(props.prodotti,key),
    });
    console.log("activeFoto=>", activeFoto);
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
            <Text>{prodotto.nome}{console.log(prodotto)}</Text>
          </Item>
        ))}
      </ActionGroup>
    </View>
  );
}

export default ProductsButton;

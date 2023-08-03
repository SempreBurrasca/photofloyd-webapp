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
  Switch,
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

import { getProductsFromFirebase } from "../../Functions/firebaseFunctions";
import Edit from "@spectrum-icons/workflow/Edit";
import ProductsButton from "./ProductsButton";
import Fotografia from "../Fotografia/Fotografia";
import { makeId } from "../../Functions/logicArray";

function InitialSellStep(props) {
  const [productIsSelected, setProductIsSelected] = useState(false);
  const [isSelectedEdit, setIsSelectedEdit] = useState(false);
  const [editSelected, setEditSelected] = useState();
  const {
    close,
    setStep,
    step,
    selectedFotos,
    prodotti,
    setProdotti,
    activeFoto,
    setActiveFoto,
    addToCart,
  } = props;
  const [stampaPreview, setStampaPreview] = useState(false);
  const [urlView, setUrlView] = useState(activeFoto.data.url);
  const [canvasImageUrl, setCanvasImageUrl] = useState(null);



  return (
    <Flex direction={"column"} gap={"size-125"}>
      <Flex justifyContent={"space-evenly"} gap={"size-150"}>
        <Flex direction={"column"} gap={"size-100"} flex={1}>
          <Heading level={4}>Prodotti</Heading>

          <ProductsButton
            prodotti={prodotti}
            activeFoto={activeFoto}
            setActiveFoto={setActiveFoto}
            productIsSelected={productIsSelected}
            setProductIsSelected={setProductIsSelected}
            editSelected={editSelected}
            isSelectedEdit={isSelectedEdit}
          />
        </Flex>
        <Flex
          direction={"column"}
          gap={"size-115"}
          flex={5}
          alignItems={"stretch"}
        >
          {activeFoto.data.modificate && (
            <Flex direction={"column"} gap={"size-100"}>
              <Text>
                {activeFoto.data.modificate.length} versioni disponibili
              </Text>
              <ActionGroup onAction={setUrlView}  density="compact" isEmphasized>
                <Item key={activeFoto.data.url}>Originale</Item>
                {activeFoto.data.modificate.map((af, index) => (
                  <Item key={af}>V-{index + 1}</Item>
                ))}
              </ActionGroup>
            </Flex>
          )}
          <Fotografia
            key={activeFoto.id}
            foto={activeFoto}
            updateFoto={setActiveFoto}
            objectFit="contain"
            height={"50vh"}
            postazioneId={props.postazioneId}
            setIsSelectedEdit={setIsSelectedEdit}
            isSelectedEdit={isSelectedEdit}
            setEditSelected={setEditSelected}
            editSelected={editSelected}
            urlView={urlView}
            setCanvasImageUrl={setCanvasImageUrl}
          />

          <ActionButton
            isDisabled={!productIsSelected}
            onPress={() => addToCart(activeFoto,canvasImageUrl)}
          >
            <ShoppingCart />
            Aggiungi al carrello
          </ActionButton>
        </Flex>
      </Flex>

      <Divider size="M" />
      <View margin={"size-125"} overflow={"auto"} padding={"size-125"}>
        <Flex gap="size-100">
          {selectedFotos.map((foto) => (
            <div
              key={foto.id + "-" + makeId(4)}
              onClick={() => setActiveFoto(foto)}
            >
              <View
                key={foto.id + "-" + makeId(4)}
                flex={1}
                borderRadius={"small"}
                borderWidth={foto.id === activeFoto.id ? "size-100" : "0px"}
                borderColor={
                  foto.id === activeFoto.id ? "blue-400" : "static-white"
                }
                position={"relative"}
              >
                <Image
                  key={foto.id + "-" + makeId(4)}
                  src={foto.data.url}
                  objectFit="cover"
                  width={"80px"}
                  height={"80px"}
                />
              </View>
            </div>
          ))}
        </Flex>
      </View>
    </Flex>
  );
}

export default InitialSellStep;

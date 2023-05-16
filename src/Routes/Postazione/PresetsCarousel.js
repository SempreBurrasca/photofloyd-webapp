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
import ProductsButton from "../../Organismi/PhotoSelling/ProductsButton";

function PresetsCarousel(props) {
  const { selectedFotos } = props;
  const [activeFoto, setActiveFoto] = useState(selectedFotos[0]);

  return (
    <View margin={"size-125"} overflow={"auto"} padding={"size-125"}>
      <Flex gap="size-100">
        {selectedFotos.map((foto) => (
          <div onClick={() => setActiveFoto(foto)}>
            <View
              key={foto.id + "-slide"}
              flex={1}
              borderRadius={"small"}
              borderWidth={foto.id === activeFoto.id ? "size-100" : "0px"}
              borderColor={
                foto.id === activeFoto.id ? "blue-400" : "static-white"
              }
              position={"relative"}
            >
              <Image
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
  );
}

export default PresetsCarousel;

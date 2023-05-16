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
import ImageAutoMode from "@spectrum-icons/workflow/ImageAutoMode";
import ProductsButton from "../../Organismi/PhotoSelling/ProductsButton";
import PresetsCarousel from "./PresetsCarousel";
import {
  finalizeSale,
  getProductsFromFirebase,
} from "../../Functions/firebaseFunctions";
import PhotoEditing from "../../Organismi/PhotoEditing/PhotoEditing";
import Edit from "@spectrum-icons/workflow/Edit";
import InitialSellStep from "../../Organismi/PhotoSelling/InitialSellStep";
import CheckOut from "../../Organismi/PhotoSelling/CheckOut";

function DialogEditFoto(props) {
  const { close, fotoToEdit, db, postazioneId, selectedFotos } = props;
  const [editedFoto, setEditedFoto] = useState(fotoToEdit);
  useEffect(() => {}, []);

  return (
    //CAMBIARE DIALOG CON DIALOG CONTAINER
    <Dialog size="L" type="fullscreen">
      <Heading>Editing Foto</Heading>
      <Divider />
      <Content>
        <PhotoEditing
          activeFoto={fotoToEdit}
          close={close}
          postazioneId={props.postazioneId}
        />
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Indietro
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogEditFoto;

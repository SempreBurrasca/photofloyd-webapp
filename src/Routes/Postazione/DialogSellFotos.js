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
  getProductsFromSettingsPostazione,
} from "../../Functions/firebaseFunctions";
import PhotoEditing from "../../Organismi/PhotoEditing/PhotoEditing";
import Edit from "@spectrum-icons/workflow/Edit";
import InitialSellStep from "../../Organismi/PhotoSelling/InitialSellStep";
import CheckOut from "../../Organismi/PhotoSelling/CheckOut";
import { getCommissioniPostazione } from "../../Functions/firebaseGetFunctions";

function DialogSellFotos(props) {
  const { close, selectedFotos } = props;
  const [activeFoto, setActiveFoto] = useState(selectedFotos[0]);
  const [step, setStep] = useState(0);
  const [metodo, setMetodo] = useState();
  const [prodotti, setProdotti] = useState([]);
  const [paymentCard, setPaymentCard] = React.useState(false);
  const [tassazione, setTassazione] = useState(0.22);
  const [editedFoto, setEditedFoto] = useState(activeFoto);
  const [checkoutData, setCheckOutData] = useState({});
  const [totalExtras, setTotalExtras] = useState({});
  const [commCarta, setCommCarta] = useState();
  useEffect(() => {
    getProductsFromSettingsPostazione(props.postazioneId).then((prd) => {
      if (prd.length > 0) {
        setProdotti(prd);
      } else {
        getProductsFromFirebase(props.db).then((prodotti) => {
          setProdotti(prodotti);
        });
      }
    });
    getCommissioniPostazione(props.postazioneId).then((d) => {
      if (d.carta) {
        setCommCarta(d.carta.prezzo);
      } else {
        setCommCarta(1);
      }
    });
  }, []);

  const addToCart = (foto) => {
    props.setCartFotos(
      props.cartFotos.concat({
        ...foto,
      })
    );
  };
  const handleStep = () => {
    //step 0 - step 1 - step 2 - step 3 (editing )
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
      console.log("checkout");
    } else if (step === 2) {
    } else if (step === 3) {
      console.log("editing");
    }
  };
  const handleBack = () => {
    if (step === 0) {
      props.setCartFotos([]);
      close();
    } else if (step === 1) {
      setStep(0);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(0);
    }
  };
  const handleDownload = async () => {
    // Create and append a link
    let link = document.createElement("a");
    document.documentElement.append(link);
    console.log("Foto nel carrello =>", props.cartFotos);
    const imgArr = props.cartFotos;
    for (let i = 0; i < imgArr.length; i++) {
      await fetch(imgArr[i].data.url)
        .then((res) => res.blob()) // Gets the response and returns it as a blob
        .then((blob) => {
          let objectURL = URL.createObjectURL(blob);

          // Set the download name and href
          link.setAttribute(
            "download",
            `${imgArr[i].product.nome}-${imgArr[i].id}.jpg`
          );
          link.href = objectURL;

          // Auto click the link
          link.click();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const totalOfProducts = (currency) => {
    let totalPrice = 0;
    props.cartFotos.forEach((element) => {
      totalPrice = totalPrice + element.product.prezzo;
    });

    if (paymentCard === 1) {
      totalPrice = totalPrice + totalPrice * commCarta;
    }
    if (currency && currency.cambio) {
      totalPrice = totalPrice * currency.cambio;
    }

    return totalPrice.toFixed(2);
  };
  const finalizzaVendita = async (arg) => {
    console.log("finalizzaVendita", arg);
    finalizeSale(arg).then((res) => {
      close();
    });
  };
  return (
    //CAMBIARE DIALOG CON DIALOG CONTAINER
    <Dialog size="L" type="fullscreen">
      <Heading>Processo di vendita</Heading>
      <Divider />
      <Content>
        <View>
          {step === 0 && (
            <InitialSellStep
              key={activeFoto.id + "-initial"}
              prodotti={prodotti}
              setProdotti={setProdotti}
              activeFoto={activeFoto}
              setActiveFoto={setActiveFoto}
              selectedFotos={selectedFotos}
              setCartFotos={props.setCartFotos}
              setStep={setStep}
              step={step}
              cartFotos={props.cartFotos}
              addToCart={addToCart}
              postazioneId={props.postazioneId}
            />
          )}

          {step === 1 && (
            <CheckOut
              cartFotos={props.cartFotos}
              setPaymentCard={setPaymentCard}
              tassazione={tassazione}
              totalOfProducts={totalOfProducts}
              handleDownload={handleDownload}
              postazioneId={props.postazioneId}
              db={props.db}
              checkoutData={checkoutData}
              finalizzaVendita={finalizzaVendita}
              totalExtras={totalExtras}
              setTotalExtras={setTotalExtras}
              paymentCard={paymentCard}
            />
          )}
          {step === 2 && <Text>Vendita effettuata correttamente</Text>}
          {step === 3 && (
            <PhotoEditing
              activeFoto={activeFoto}
              setActiveFoto={setActiveFoto}
              cartFotos={props.cartFotos}
              setCartFotos={props.setCartFotos}
              editedFoto={editedFoto}
              setEditedFoto={setEditedFoto}
              close={handleBack}
              postazioneId={props.postazioneId}
            />
          )}
        </View>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={handleBack}>
          Indietro
        </Button>
        {step !== 3 && step !== 1 && (
          <Button
            autoFocus
            variant="accent"
            onPress={handleStep}
            isDisabled={props.cartFotos.length === 0}
          >
            Procedi con {props.cartFotos.length} prodotti
          </Button>
        )}
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogSellFotos;

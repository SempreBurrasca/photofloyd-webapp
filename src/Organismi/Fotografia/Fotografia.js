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
  Image as ImageRS,
  Item,
  Menu,
  MenuTrigger,
  Picker,
  Switch,
  TabList,
  TabPanels,
  Tabs,
  Text,
  TextField,
  ToggleButton,
  View,
  Well,
} from "@adobe/react-spectrum";
import { getEdits } from "../../Functions/firebaseGetFunctions";
import Landscape from "@spectrum-icons/workflow/Landscape";
import Portrait from "@spectrum-icons/workflow/Portrait";
import FullScreen from "@spectrum-icons/workflow/FullScreen";

function Fotografia(props) {
  const {
    foto,
    postazioneId,
    setIsSelectedEdit,
    setEditSelected,
    isSelectedEdit,
    editSelected,
    updateFoto,
  } = props;
  const [productIsSelected, setProductIsSelected] = useState(false);
  const [edits, setEdits] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState();
  const [orientation, setOrientation] = useState("horizontal");
  const [fillCanvas, setFillCanvas] = useState(false);

  useEffect(() => {
    getEdits(postazioneId, foto.id).then((_edits) => {
      setEdits([{ id: "original", name: "Originale" }, ..._edits]);
    });
  }, [foto]);
  const canvasRef = React.useRef();

  useEffect(() => {
    if (foto.product && foto.product.isStampa) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      // Set canvas dimensions
      const DPI = 96;
      const maxWidth = 300; // maximum width of canvas in pixels
      const maxHeight = 300; // maximum height of canvas in pixels

      // Calculate width and height in pixels
      const widthInPixels = (foto.product.width / 2.54) * DPI;
      const heightInPixels = (foto.product.height / 2.54) * DPI;

      // Calculate aspect ratio
      const aspectRatio = widthInPixels / heightInPixels;

      // Calculate scaled dimensions
      let scaledWidth, scaledHeight;
      if (widthInPixels > maxWidth || heightInPixels > maxHeight) {
        if (orientation === "vertical") {
          // landscape
          scaledWidth = maxWidth;
          scaledHeight = maxWidth / aspectRatio;
        } else {
          // portrait
          scaledWidth = maxHeight / aspectRatio;
          scaledHeight = maxHeight;
        }
      } else {
        scaledWidth = widthInPixels;
        scaledHeight = heightInPixels;
      }

      // Set canvas dimensions
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      // Draw background
      ctx.fillStyle = "red" ;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw image
      const img = new Image();
      img.src =
        edits.length > 0 && isSelectedEdit ? editSelected.url : foto.data.url;
      img.onload = () => {
        // Calculate image aspect ratio
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        // Calculate canvas aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        // Calculate scaled image dimensions
        let scaledImgWidth, scaledImgHeight;
        if (fillCanvas) {
          if (imgAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas
            scaledImgHeight = canvas.height;
            scaledImgWidth = canvas.height * imgAspectRatio;
          } else {
            // Image is taller than canvas
            scaledImgWidth = canvas.width;
            scaledImgHeight = canvas.width / imgAspectRatio;
          }
        } else {
          if (imgAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas
            scaledImgWidth = canvas.width;
            scaledImgHeight = canvas.width / imgAspectRatio;
          } else {
            // Image is taller than canvas
            scaledImgHeight = canvas.height;
            scaledImgWidth = canvas.height * imgAspectRatio;
          }
        }
        // Calculate position to center image on canvas
        const posX = (canvas.width - scaledImgWidth) / 2;
        const posY = (canvas.height - scaledImgHeight) / 2;
        // Draw image on canvas
        ctx.drawImage(img, posX, posY, scaledImgWidth, scaledImgHeight);
      };
    }
  }, [foto, edits, isSelectedEdit, editSelected, orientation, fillCanvas]);
  useEffect(() => {
    let obj = foto;
    obj.product = {
      ...foto.product,
      orientation: orientation,
      fillCanvas: fillCanvas,
    };
    updateFoto(obj);
  }, [fillCanvas, orientation]);
  return (
    <Flex direction={"column"} gap={"size-115"} alignItems={"center"}>
      {foto.product && foto.product.isStampa ? (
        <Flex direction={"column"} gap="size-100">
          <Flex gap="size-100">
            <ToggleButton
              isEmphasized
              isSelected={fillCanvas}
              onChange={setFillCanvas}
            >
              <FullScreen />
            </ToggleButton>
            <ActionGroup
              isEmphasized
              selectionMode="single"
              onAction={setOrientation}
              defaultSelectedKeys={["horizontal"]}
            >
              <Item key="horizontal">
                <Landscape />
              </Item>
              <Item key="vertical">
                <Portrait />
              </Item>
            </ActionGroup>
          </Flex>
          <canvas ref={canvasRef} />
        </Flex>
      ) : (
        <ImageRS
          src={
            edits.length > 0 && isSelectedEdit
              ? editSelected.url
              : foto.data.url
          }
          height={props.height}
          objectFit={props.objectFit}
        />
      )}
    </Flex>
  );
}

export default Fotografia;

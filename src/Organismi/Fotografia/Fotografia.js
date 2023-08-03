import React, { useState, useEffect, useRef } from "react";
//Importazione delle funzioni e dei componenti necessari
import { getEdits } from "../../Functions/firebaseGetFunctions";
import {
  Flex,
  ActionGroup,
  ToggleButton,
  Item,
  Image as ImageRS,
} from "@adobe/react-spectrum";
import Landscape from "@spectrum-icons/workflow/Landscape";
import Portrait from "@spectrum-icons/workflow/Portrait";
import FullScreen from "@spectrum-icons/workflow/FullScreen";

//Inizio della funzione Fotografia
function Fotografia(props) {
  //Dichiarazione delle prop che saranno utilizzate
  const { foto, postazioneId, updateFoto, urlView,setCanvasImageUrl } = props;

  //Stati per la gestione dell'orientamento e del riempimento del canvas
  const [fillCanvas, setFillCanvas] = useState(false);
  const [orientation, setOrientation] = useState("horizontal");

  //Variabili di stato per il dragging della foto
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 });

  //Stato per lo zoom
  const [zoom, setZoom] = useState(1);

  //Dichiarazione di useRef per ottenere il riferimento al canvas
  const canvasRef = useRef();

  //useEffect per gestire il disegno del canvas
  useEffect(() => {
    //Verifica se il prodotto è una Stampa
    if (foto.product && foto.product.isStampa) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      //Impostazioni per dimensioni e DPI
      const DPI = 96;
      const maxWidth = 300;
      const maxHeight = 300;

      //Calcolo le dimensioni in pixel
      const widthInPixels = (foto.product.width / 2.54) * DPI;
      const heightInPixels = (foto.product.height / 2.54) * DPI;

      //Calcolo il rapporto di aspetto
      const aspectRatio = widthInPixels / heightInPixels;

      //Calcolo le dimensioni scalate
      let scaledWidth, scaledHeight;
      if (widthInPixels > maxWidth || heightInPixels > maxHeight) {
        if (orientation === "vertical") {
          scaledWidth = maxWidth;
          scaledHeight = maxWidth / aspectRatio;
        } else {
          scaledWidth = maxHeight / aspectRatio;
          scaledHeight = maxHeight;
        }
      } else {
        scaledWidth = widthInPixels;
        scaledHeight = heightInPixels;
      }

      //Imposto le dimensioni del canvas e riempio con il colore rosso
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      //Creazione di una nuova immagine e impostazione del src
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = urlView;

      //Quando l'immagine viene caricata, la disegno sul canvas
      img.onload = () => {
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasAspectRatio = canvas.width / canvas.height;

        //Calcolo le dimensioni scalate dell'immagine
        let scaledImgWidth, scaledImgHeight;
        if (fillCanvas) {
          if (imgAspectRatio > canvasAspectRatio) {
            scaledImgHeight = canvas.height;
            scaledImgWidth = canvas.height * imgAspectRatio;
          } else {
            scaledImgWidth = canvas.width;
            scaledImgHeight = canvas.width / imgAspectRatio;
          }
        } else {
          if (imgAspectRatio > canvasAspectRatio) {
            scaledImgWidth = canvas.width;
            scaledImgHeight = canvas.width / imgAspectRatio;
          } else {
            scaledImgHeight = canvas.height;
            scaledImgWidth = canvas.height * imgAspectRatio;
          }
        }

        //Calcolo le posizioni X e Y dell'immagine sul canvas
        const posX = (canvas.width - scaledImgWidth) / 2;
        const posY = (canvas.height - scaledImgHeight) / 2;

        //Disegno l'immagine sul canvas
        ctx.drawImage(img, imagePos.x + posX, imagePos.y + posY, scaledImgWidth * zoom, scaledImgHeight * zoom);


        // Creo e carico l'immagine demo
  const demoImg = new Image();
  demoImg.src = foto.product.demoURL;

  new Promise((resolve, reject) => {
    demoImg.onload = () => {
      try {
        // Aggiusto la trasparenza dell'immagine demo
        ctx.globalAlpha = 0.8;

        // Disegno l'immagine demo sul canvas
        ctx.drawImage(demoImg, 0, 0, canvas.width, canvas.height);

        // Ripristino l'opacità
        ctx.globalAlpha = 1.0;

        resolve();
      } catch (err) {
        reject(err);
      }
    };
  })
  .then(() => {
    setCanvasImageUrl(canvas.toDataURL("image/jpeg", 1.0));
  })
  .catch(err => {
    console.error('Error loading demoImg: ', err);
  });
      
      };
    }else{
      setCanvasImageUrl(false)
    }
  }, [foto, fillCanvas, orientation, urlView,imagePos,zoom]); //Dipendenze useEffect

  //useEffect per aggiornare le proprietà del prodotto
  useEffect(() => {
    let obj = foto;
    obj.product = {
      ...foto.product,
      orientation: orientation,
      fillCanvas: fillCanvas,
    };
    updateFoto(obj);
  }, [fillCanvas, orientation]);

  //useEffect per il dragging della foto
  useEffect(() => {
    if (foto.product && foto.product.isStampa) {
    const canvas = canvasRef.current;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - mousePos.x;
        const dy = e.clientY - mousePos.y;
        setImagePos({ x: imagePos.x + dx, y: imagePos.y + dy });
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = 0.1;
      const direction = e.deltaY < 0 ? 1 : -1;
      setZoom(prevZoom => Math.max(0.1, prevZoom + direction * zoomFactor));
    };

    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }
  }, [isDragging, mousePos, imagePos,zoom,foto]);



  //Rendering del componente
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
          </Flex>
          <canvas ref={canvasRef} />
        </Flex>
      ) : (
        <ImageRS
          src={urlView}
          height={props.height}
          objectFit={props.objectFit}
        />
      )}
    </Flex>
  );
}

export default Fotografia;

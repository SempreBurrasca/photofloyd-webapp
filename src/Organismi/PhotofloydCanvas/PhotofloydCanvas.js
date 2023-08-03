import React, { useRef, useEffect, useState } from "react";
import seppia from "../../asset/filtri/seppia.png";

function PhotofloydCanvas(props) {
  const {
    imageUrl,
    update,
    filter,
    activeFoto,
    cropping,
    setCropping,
    saveNow,
    setSaveNow,
    cornice,
    setCornice,
  } = props;
  const [container, setContainer] = useState();
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [cropStart, setCropStart] = useState();
  const [cropEnd, setCropEnd] = useState();
  const [cronologia, setCronologia] = useState([]);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageDrawn, setImageDrawn] = useState(false);
  const [datiImmagine, setDatiImmagine] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setDragging(false);
    setLastX(0);
    setLastY(0);
    setCropping(false);
    setCropStart();
    setCropEnd();
    setCornice(false);
  }, [activeFoto]);

  useEffect(() => {
    drawImageInitial();
    setImageDrawn(true);
  }, [imageUrl, update, zoom, offsetX, offsetY, filter, cornice]);

  useEffect(() => {
    if (saveNow && imageDrawn) {
      console.log("Salva");
      saveImageFromCanvas();
    }
  }, [saveNow, imageDrawn]);

  //Funzione che disegna le cornici sul canvas
  const drawCornice = async (statImage, ctx, maxWidth, maxHeight) => {
    if (cornice) {
      const corn = new Image();
      corn.crossOrigin = "anonymous";
      corn.src = cornice;
      const _z = corn.naturalWidth / corn.naturalHeight;
      statImage = {
        ...statImage,
        rapportCornice: _z,
        corniceNW: corn.naturalWidth,
        corniceNH: corn.naturalHeight,
        corniceX: 0,
        corniceY: 0,
        cornicerSRC: cornice,
      };
      if (corn.naturalWidth > corn.naturalHeight) {
        console.log(maxHeight);
        ctx.drawImage(corn, 0, 0, maxHeight * _z, maxHeight);
        statImage.corniceSW = maxHeight * _z;
        statImage.corniceSH = maxHeight;
      } else {
        ctx.drawImage(corn, 0, 0, maxHeight * _z, maxHeight);
        statImage.corniceSW = maxHeight * _z;
        statImage.corniceSH = maxHeight;
      }
    }
    return statImage;
  };

  //funzione principale che gestisce la renderizzazione del canvas
  const drawImageInitial = () => {
    const _container = document.getElementById("canv-container");
    setContainer(_container);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    let statImage = {};
    img.onload = () => {
      // Calcola le coordinate e le dimensioni dell'immagine
      const x = offsetX;
      const y = offsetY;
      const maxWidth = _container.offsetWidth;
      const maxHeight = _container.offsetHeight;

      let width = img.naturalWidth;
      let height = img.naturalHeight;
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      // Memorizza le coordinate e le dimensioni dell'immagine
      setImageX(x);
      setImageY(y);
      setImageWidth(width);
      setImageHeight(height);
      statImage = {
        imgSRC: imageUrl,
        imgX: x,
        imgY: y,
        imgSW: width,
        imgSH: height,
        imgNW: img.naturalWidth,
        imgNH: img.naturalHeight,
      };
      drawCornice(statImage, ctx, maxWidth, maxHeight).then(
        (_si) => (statImage = _si)
      );
      /*Fare in modo che dalla sidebar si aggiungano questi filtri come immagini  */
      if (filter === "seppia") {
        ctx.filter = "none";
        const pngImage = new Image();
        pngImage.src = seppia;
        pngImage.onload = () => {
          ctx.drawImage(img, offsetX, offsetY, width * zoom, height * zoom);
          ctx.globalCompositeOperation = "multiply";
          ctx.drawImage(
            pngImage,
            offsetX,
            offsetY,
            width * zoom,
            height * zoom
          );
          ctx.globalCompositeOperation = "normal";
          drawCornice(statImage, ctx, maxWidth, maxHeight).then(
            (_si) => (statImage = _si)
          );
        };
        statImage.filter = "seppia";
        statImage.filterURL = seppia;
      } else if (filter !== "" && filter !== "seppia") {
        ctx.filter = filter;
        statImage.filter = filter;
        ctx.drawImage(img, offsetX, offsetY, width * zoom, height * zoom);
        drawCornice(statImage, ctx, maxWidth, maxHeight).then(
          (_si) => (statImage = _si)
        );
      } else {
        ctx.drawImage(img, offsetX, offsetY, width * zoom, height * zoom);
        drawCornice(statImage, ctx, maxWidth, maxHeight).then(
          (_si) => (statImage = _si)
        );
      }
      //se esiste una cornice nascondo la parte fuori dalla cornice
      if (cornice) {
        const corn = new Image();
        corn.crossOrigin = "anonymous";
        corn.src = cornice;
        corn.onload = () => {
          const _z = corn.naturalWidth / corn.naturalHeight;
          ctx.clearRect(maxHeight * _z, 0, maxWidth, maxHeight);
          ctx.fillStyle = "rgb(0, 0, 0,0.5)";
          ctx.fill();
        };
      }

      setDatiImmagine(statImage);
    };
  };

  const handleWheel = (e) => {
    let newZoom;
    if (e.deltaY < 0) {
      newZoom = zoom * 1.1;
    } else {
      newZoom = zoom * 0.9;
    }
    // Calculate the mouse position relative to the canvas
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top; // y position within the element.

    // Calculate the new offsets
    setOffsetX(offsetX - (newZoom - zoom) * x);
    setOffsetY(offsetY - (newZoom - zoom) * y);
    // Update the zoom
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    if (cropping) {
    } else {
      setDragging(true);
      setLastX(e.clientX);
      setLastY(e.clientY);
    }
  };

  const handleMouseUp = (e) => {
    if (cropping) {
    } else {
      setDragging(false);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      let xDiff = e.clientX - lastX;
      let yDiff = e.clientY - lastY;
      setOffsetX(offsetX + xDiff);
      setOffsetY(offsetY + yDiff);
      setLastX(e.clientX);
      setLastY(e.clientY);
    }
  };

  const saveImageFromCanvas = () => {
    {
      setSaveNow(false);
      if (datiImmagine) {
        // Create a new image element
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        // Crea la cornice

        const corn = new Image();
        corn.crossOrigin = "anonymous";
        corn.src = cornice&&cornice;

        // Create a new temporary canvas
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (cornice) {
          // Imposto le dimensioni del canvas per farle uguali a quella della cornice della cornice
          tempCanvas.width = corn.naturalWidth;
          tempCanvas.height = corn.naturalHeight;
        } else {
          // Imposto le dimensioni del canvas per farle uguali a quella della cornice della cornice
          tempCanvas.width = img.naturalWidth;
          tempCanvas.height = img.naturalHeight;
        }

        // Draw the image onto the temporary canvas
        img.onload = () => {
          console.log("Dati da salvare =>", datiImmagine);
          //disegno l'immagine
          tempCtx.drawImage(
            img,
            datiImmagine.imgX,
            datiImmagine.imgY,
            datiImmagine.imgNW * zoom,
            datiImmagine.imgNH * zoom
          );
          // Applico il filtro
          if (filter === "seppia") {
            tempCtx.filter = "none";
            const pngImage = new Image();
            pngImage.src = seppia;
            pngImage.onload = () => {
              tempCtx.globalCompositeOperation = "multiply";
              tempCtx.drawImage(
                pngImage,
                0,
                0,
                img.naturalWidth,
                img.naturalHeight
              );
            };
            console.log(filter);
            if(!cornice){
              //salvo immagine
              saveImage();
           }
          } else if (filter !== "" && filter !== "seppia") {
            tempCtx.filter = filter;
            console.log(filter);
            if(!cornice){
              //salvo immagine
              saveImage();
           }
          } else {
            console.log("no filter");
            if(!cornice){
              //salvo immagine
              saveImage();
           }
          }
          //disegno la cornice
          corn.onload = () => {
            tempCtx.drawImage(
              corn,
              0,
              0,
              corn.naturalWidth,
              corn.naturalHeight
            );

            //salvo immagine
            saveImage();
          };
  
        };

        function saveImage() {
          // Get a base64-encoded image from the temporary canvas
          const dataURL = tempCanvas.toDataURL();

          // Create a temporary anchor element
          const link = document.createElement("a");
          link.download = "image.png";
          link.href = dataURL;
          document.body.appendChild(link);

          // Click on the anchor element to download the image
          link.click();

          // Remove the anchor element from the DOM
          document.body.removeChild(link);
        }
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={container && container.offsetWidth + "px"}
      height={container && container.offsetHeight + "px"}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
}

export default PhotofloydCanvas;

import React, { useRef, useEffect, useState } from "react";
import seppia from "../../filtri/seppia.png";

function PhotofloydCanvas(props) {
  const { imageUrl, update, filter, activeFoto, cropping,setCropping } = props;
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
  }, [activeFoto]);

  useEffect(() => {
    const _container = document.getElementById("canv-container");
    setContainer(_container);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.crossOrigin="anonymous"
    img.src = imageUrl;
    img.onload = () => {
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
      /*Fare in modo che dalla sidebar si aggiungano questi filtri come immagini  */

      if (filter === "seppia") {
        ctx.filter = "none";
        const pngImage = new Image();
        pngImage.src = seppia;
        pngImage.onload = () => {
          ctx.globalCompositeOperation = "multiply";
          ctx.drawImage(
            pngImage,
            offsetX,
            offsetY,
            width * zoom,
            height * zoom
          );
        };
      } else if (filter !== "" && filter !== "seppia") {
        ctx.filter = filter;
      }

      ctx.drawImage(img, offsetX, offsetY, width * zoom, height * zoom);
    };

  }, [imageUrl, update, zoom, offsetX, offsetY, filter]);



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
      // Get the canvas context
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
  
      // Get the mouse position relative to the canvas
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top; // y position within the element.
  
      // Set the stroke style and draw a rectangle
      ctx.strokeStyle = "red";
      ctx.strokeRect(x, y, 100, 100);
    } else {
      setDragging(true);
      setLastX(e.clientX);
      setLastY(e.clientY);
    }
  };

  const handleMouseUp = (e) => {
    if (cropping) {
      setCropEnd({ x: e.clientX, y: e.clientY });
      // Update canvas with cropped image
      const canvas = canvasRef.current;

  
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
    } else if (cropping) {

    }
  };

  const saveCronologiaModifiche = () => {
    let _arr = cronologia;
    _arr.push({
      foto: activeFoto,
      zoom: zoom,
      offsetX: offsetX,
      offsetY: offsetY,
      lastX: lastX,
      lastY: lastY,
      cropping: cropping,
      cropStart: cropStart,
      cropEnd: cropEnd,
      filter:filter
    });
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

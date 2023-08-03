export function getCurrentDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export const containsObject = (array, object) => {
  return array.some((item) => JSON.stringify(item) === JSON.stringify(object));
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = "Anonymous"; // This enables CORS
      img.src = src;
  });
}

export async function applyWatermark(imageSrc, watermarkSrc) {
  let image = await loadImage(imageSrc);
  let watermark = await loadImage(watermarkSrc);

  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  ctx.drawImage(watermark, (image.width/2) - (watermark.width/2), (image.height/2) - (watermark.height/2));

  return canvas.toDataURL();
}

export function dataURLToBlob(dataURL) {
  let parts = dataURL.split(';base64,');
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {type: contentType});
}
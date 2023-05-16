import { makeId } from "./logicArray";

export const getImagesFromFileInput = (idInput) => {
  return new Promise(function (resolve, reject) {
    const fileSelector = document.querySelector(idInput);
    console.log(fileSelector);
    if (!fileSelector) {
      reject(new Error("No file selector found"));
      return;
    }
    const files = fileSelector.files;
    if (!files || files.length === 0) {
      reject(new Error("No files selected"));
      return;
    }
    const images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageURL = URL.createObjectURL(file);
      images.push({
        name: makeId(5) + "-" + file.name,
        url: imageURL,
        tags: [],
      });
    }
    resolve(images);
  });
};

const convertBlobUrlToBlob = async (blobURL, name) => {
  // Convert the blob URL to a Blob object
  const response = await fetch(blobURL);

  const blob = await response.blob();

  const mimeType = await response.headers.get("Content-Type");

  const file = new File([blob], name, { type: mimeType });
  return file;
};

//Upload delle foto
export const uploadFotoFinal = async (object) => {
  console.log(object);
  const formData = new FormData();

  // Wait for all the blob URLs to be converted to File objects
  const files = await Promise.all(
    object.photos.map((image) => convertBlobUrlToBlob(image.url, image.name))
  );

  // Append each File object to the FormData object
  files.forEach((file) => {
    formData.append("photos[]", file);
  });

  // Send the FormData object using fetch
  fetch(process.env.PUBLIC_URL + "/upload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response;
      } else {
        throw new Error("Errore nel caricamento dei file");
      }
    })
    .then((data) => {
      console.log("File caricati con successo: ", data);
      return data;
    })
    .catch((error) => {
      console.error("Errore: ", error);
    });
};

export const saveToBrowserStorage = (f) => {
  const mainDirectory = "";
  // Check for support indexedDB.
};

export const uploadSingleImage = async (imageObject) => {
  // Extract the image data from the object
  const { imageBase64,fullName,mimeType } = imageObject;

  // Convert the base64 data to a blob
  const response = await fetch(imageBase64);
  const blob = await response.blob();

  const formData = new FormData();

  // Wait for all the blob URLs to be converted to File objects
  const files = [new File([blob], fullName, { type: mimeType })];

  // Append each File object to the FormData object
  files.forEach((file) => {
    formData.append("photos[]", file);
  });

  // Send the FormData object using fetch
  fetch(process.env.PUBLIC_URL + "/upload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response;
      } else {
        throw new Error("Errore nel caricamento dei file");
      }
    })
    .then((data) => {
      console.log("File caricati con successo: ", data);
      return data;
    })
    .catch((error) => {
      console.error("Errore: ", error);
    });
};

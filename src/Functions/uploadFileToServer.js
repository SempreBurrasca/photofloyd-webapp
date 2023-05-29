import { useContext } from "react";
import { makeId } from "./logicArray";
import Compressor from "compressorjs";
import { StateContext } from "../Context/stateContext";

export const getImagesFromFileInput = (idInput) => {
  const preId = makeId(4)
  return new Promise(function (resolve, reject) {
    const fileSelector = document.querySelector(idInput);
    if (!fileSelector) {
      reject(new Error("No file selector found"));
      return;
    }
    const files = fileSelector.files;
    if (!files || files.length === 0) {
      reject(new Error("No files selected"));
      return;
    }
    let totalSizeInBytes = 0;
    for (let i = 0; i < files.length; i++) {
      totalSizeInBytes += files[i].size;
    }
    const totalSizeInMB = totalSizeInBytes / (1024 * 1024);
    console.log(`Total size: ${totalSizeInMB} MB`);

    const images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageURL = URL.createObjectURL(file);
      images.push({
        name: preId+'-'+i,
        url: imageURL,
        type: file.type,
        tags: [],
      });
    }
    resolve(images);
  });
};

const convertBlobUrlToBlob = async (blobURL, name, type) => {
  // Convert the blob URL to a Blob object
  const response = await fetch(blobURL);

  let blob = await response.blob();

  // Compress the image if its size exceeds 2MB
  if (blob.size > 2 * 1024 * 1024) {
    blob = await new Promise((resolve) => {
      new Compressor(blob, {
        quality: 0.6,
        success(result) {
          resolve(result);
        },
      });
    });
  }

  const mimeType = await response.headers.get("Content-Type");

  // Get the file extension from the MIME type
  const extension = mimeType.split("/")[1];

  // Add the file extension to the name
  const fileName = `${name}.${extension}`;

  const file = new File([blob], fileName, { type: mimeType });
  return file;
};

//Upload delle foto
export const uploadFotoFinal = async (object, dispatch) => {
  dispatch({ type: "SET_IS_UPLOAD", isUpload: true });

  // Set the initial upload status
  dispatch({
    type: "SET_UPLOAD_STATUS",
    statusUpload: {
      max: object.photos.length,
      current: 0,
      label: "",
    },
  });

  // Split the photos array into chunks of 20 photos
  const chunkSize = 20;
  for (let i = 0; i < object.photos.length; i += chunkSize) {
    const chunk = object.photos.slice(i, i + chunkSize);

    // Wait for all the blob URLs in the current chunk to be converted to File objects
    const files = await Promise.all(
      chunk.map((image) =>
        convertBlobUrlToBlob(image.url, image.name, image.type)
      )
    );

    // Upload all the files in the current chunk
    await Promise.all(
      files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("photos[]", file);

        // Update the upload status
        dispatch({
          type: "SET_UPLOAD_STATUS",
          statusUpload: {
            max: object.photos.length,
            current: i + index,
            label: file.name,
          },
        });

        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        xhr.open("POST", process.env.PUBLIC_URL + "/upload.php");

        // Listen to the progress event
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = event.loaded / event.total;
          }
        });

        // Send the FormData object
        xhr.send(formData);

        // Wait for the upload to complete
        await new Promise((resolve) => {
          xhr.addEventListener("load", resolve);
          xhr.addEventListener("error", resolve);
          xhr.addEventListener("abort", resolve);
        });
      })
    );
  }

  dispatch({
    type: "SET_UPLOAD_STATUS",
    statusUpload: {
      max: 100,
      current: 0,
      label: "caricamenteo in corso...",
    },
  });
  dispatch({ type: "SET_IS_UPLOAD", isUpload: false });
};



export const saveToBrowserStorage = (f) => {
  const mainDirectory = "";
  // Check for support indexedDB.
};

export const uploadSingleImage = async (imageObject) => {
  // Extract the image data from the object
  const { imageBase64, fullName, mimeType } = imageObject;

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

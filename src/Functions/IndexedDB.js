import { getCurrentDateTimeString } from "./tools";

// Configura e apri il database IndexedDB
const dbName = "photofloyd-upload";
let storeName = "upload-X"; // Modifica questa variabile per utilizzare un nome diverso per lo store
let db;

const openDBRequest = indexedDB.open(dbName, 1);

openDBRequest.onerror = function (event) {
  console.error(
    "Errore nell'aprire il database IndexedDB:",
    event.target.errorCode
  );
};

openDBRequest.onsuccess = function (event) {
  db = event.target.result;
};

openDBRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
  }
};

//La funzione `saveImage` è responsabile della memorizzazione effettiva delle immagini nel database IndexedDB. Nel ciclo `for (const file of files)` vengono lette e salvate le immagini sequenzialmente utilizzando una `Promise`.
const saveImage = (imageBuffer,imageName,imageType) => {
  if (db) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.add({ name: imageName, data: imageBuffer, type: imageType });

    transaction.oncomplete = function () {
      console.log("Immagine salvata in IndexedDB.");
    };

    transaction.onerror = function (event) {
      console.error(
        "Errore nel salvare l'immagine in IndexedDB:",
        event.target.errorCode
      );
    };
  } else {
    console.error("Il database IndexedDB non è stato aperto correttamente.");
  }

};

const saveArrayToIDB = async (myFiles) => {
  const files = myFiles;

  for (const file of files) {
    if (file && file.type.match("image.*")) {
      await new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = function (e) {
          const imageBuffer = e.target.result;
          saveImage(imageBuffer, file.name, file.type);
          resolve();
        };
        reader.readAsArrayBuffer(file);
      });
    } else {
      console.error("File non valido, si prega di selezionare un'immagine.");
    }
  }
};

export const uploadToIndexedDB = () => {
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB.");
    return;
  }
  var fileselector = document.getElementById("files");
  const files = fileselector.files;
  saveArrayToIDB(files);
};

export const getImagesFromIndexedDB = () => {
  return new Promise(function (resolve, reject) {
    const openRequest = indexedDB.open(dbName);

    openRequest.onsuccess = function (e) {
      const db = e.target.result;
      const images = [];
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();

      request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const imageInfo = cursor.value;

          // Creare un Blob dall'ArrayBuffer e impostare il tipo MIME corretto
          const blob = new Blob([imageInfo.data], { type: imageInfo.type });

          // Creare un oggetto URL temporaneo per l'immagine
          const imageURL = URL.createObjectURL(blob);

          images.push({ name: imageInfo.name, url: imageURL });
          cursor.continue();
        } else {
          resolve(images);
        }
      };

      request.onerror = function () {
        reject(new Error("Error retrieving images from IndexedDB"));
      };
    };

    openRequest.onerror = function (e) {
      reject(new Error("Error opening IndexedDB:" + e.target.errorCode));
    };
  });
};

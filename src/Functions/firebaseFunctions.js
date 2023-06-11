import { ToastQueue } from "@react-spectrum/toast";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
  getFirestore,
  deleteDoc,
  addDoc,
  listCollections,
  increment,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const incrementUploadCounter = async (db, postazioneId) => {
  try {
    const postazioneRef = doc(db, "postazioni", postazioneId);
    await updateDoc(postazioneRef, {
      uploadCounter: increment(1),
    });
    console.log("uploadCounter incremented successfully");
  } catch (error) {
    console.error("Error incrementing uploadCounter:", error);
  }
};
export const resetUploadCounter = async (postazioneId, count) => {
  const db = getFirestore();
  try {
    const postazioneRef = doc(db, "postazioni", postazioneId);
    await updateDoc(postazioneRef, {
      uploadCounter: count,
    });
    console.log("uploadCounter incremented successfully");
    ToastQueue.positive("Contatore impostato correttamente", { timeout: 500 });
  } catch (error) {
    console.error("Error incrementing uploadCounter:", error);
    ToastQueue.negative(error, { timeout: 1500 });
  }
};
export const getPostazioneDoc = async (
  db,
  postazioneId,
  callback,
  callback2
) => {
  const docRef = doc(db, "postazioni", postazioneId);
  const docSnap = await getDoc(docRef);
  try {
    if (docSnap.exists()) {
      await callback(docSnap.data());
      await callback2({
        type: "SET_CURRENT_POSTAZIONE",
        currentPostazione: docSnap.data(),
      });
      return "Documento recuperato con successo";
    } else {
      // docSnap.data() will be undefined in this case
      return "Non c'è il documento da recuperare (impostazioni=>tag)'";
    }
  } catch (error) {
    return "Errore nel caricamento del documento: " + error;
  }
};
export const savePhotosToFirebase = async (
  db,
  photos,
  postazioneId,
  selectedTags
) => {
  try {
    const batch = writeBatch(db);
    const auth = getAuth();
    const user = auth.currentUser;
    photos.photos.forEach((photo) => {
      // Get the file extension from the MIME type
      const extension = photo.type.split("/")[1];

      // Add the file extension to the name
      const fileName = `${photo.name}.${extension}`;

      const photoRef = doc(
        db,
        "postazioni",
        postazioneId,
        "fotografie",
        fileName
      );
      batch.set(photoRef, {
        name: fileName,
        url: "https://www.photofloyd.cloud/app/upload/" + fileName,
        lastModified: photo.lastModified,
        tags: selectedTags,
        label: " ",
        fotografo: {
          nome: user.displayName && user.displayName,
          uid: user.uid,
        },
      });
    });

    await batch.commit();
    incrementUploadCounter(db, postazioneId);
    ToastQueue.positive("Foto salvate con successo nel Database", {
      timeout: 2000,
    });
  } catch (error) {
    console.log(error);
    ToastQueue.negative("Errore nel salvare le foto sul Database" + error, {
      timeout: 2000,
    });
  }
};

export const updatePhotoTags = async (db, array, newTags, postazioneId) => {
  try {
    for (const photo of array) {
      const photoRef = doc(
        db,
        "postazioni",
        postazioneId,
        "fotografie",
        photo.data.name
      );
      await updateDoc(photoRef, {
        tags: photo.data.tags.concat(newTags),
      });
      console.log("Tags updated successfully");
    }
    await ToastQueue.positive("Tags aggiornati con successo", {
      timeout: 2000,
    });
  } catch (error) {
    ToastQueue.positive("Error updating tags: " + error, { timeout: 2000 });
  }
};

export const updatePhotoLabel = async (db, photo, label, postazioneId) => {
  try {
    const photoRef = doc(
      db,
      "postazioni",
      postazioneId,
      "fotografie",
      photo.name
    );
    await updateDoc(photoRef, {
      label: label,
    });
    console.log("Tags updated successfully");

    await ToastQueue.positive("Label aggiornato con successo", {
      timeout: 2000,
    });
  } catch (error) {
    ToastQueue.negative("Error updating tags: " + error, { timeout: 2000 });
  }
};

export const getCartelle = (db, postazioneId, callback) => {
  const collectionRef = collection(db, "postazioni", postazioneId, "cartelle");
  const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
    const cartelle = [];
    querySnapshot.forEach((doc) => {
      cartelle.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    console.log("Cartelle retrieved successfully");
    callback(cartelle);
  });
  return unsubscribe;
};

export const addPhotosToFolders = async (
  db,
  postazioneId,
  folderNames,
  photos
) => {
  try {
    console.log(photos);
    const batch = writeBatch(db);
    for (const folderName of folderNames) {
      if (folderName && folderName !== "") {
        console.log(folderName);
        const folderRef = doc(
          db,
          "postazioni",
          postazioneId,
          "cartelle",
          folderName
        );
        const photoRefs = await photos.map((photoName) =>
          doc(db, "postazioni", postazioneId, "fotografie", photoName.id)
        );
        const folderDoc = await getDoc(folderRef);
        if (folderDoc.exists()) {
          // La cartella esiste già
          batch.update(folderRef, {
            photos: arrayUnion(...photoRefs),
          });
        } else {
          // La cartella non esiste ancora
          batch.set(folderRef, {
            name: folderName,
            photos: photos.map((photoName) =>
              doc(db, "postazioni", postazioneId, "fotografie", photoName.id)
            ),
          });
        }
      }
    }
    await batch.commit();
    ToastQueue.positive("Photos added to folders successfully", {
      timeout: 2000,
    });
  } catch (error) {
    console.log(error);
    ToastQueue.negative("Error adding photos to folders: " + error, {
      timeout: 2000,
    });
  }
};
export const deletePhotosFromFirestore = async (db, postazioneId, photos) => {
  try {
    const batch = writeBatch(db);
    for (const photo of photos) {
      const photoRef = doc(
        db,
        "postazioni",
        postazioneId,
        "fotografie",
        photo.id
      );
      batch.delete(photoRef);
    }
    await batch.commit();
    ToastQueue.positive("Foto eliminate con successo", {
      timeout: 2000,
    });
  } catch (error) {
    ToastQueue.negative("Errore con l'eliminazione delle foto: " + error, {
      timeout: 2000,
    });
  }
};

export const getPhotoNames = async (db, folderNames, postazioneId) => {
  let photoNames = [];
  for (const folderName of folderNames) {
    const docRef = doc(db, "postazioni", postazioneId, "cartelle", folderName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      docSnap.data().photos.forEach((photoRef) => {
        photoNames.push(photoRef.id);
      });
    } else {
      console.log("No such document!");
    }
  }
  return photoNames;
};
export const getPhotoNamesByClient = async (db, clientName, postazioneId) => {
  let photoNames = [];
  const docRef = doc(db, "postazioni", postazioneId, "clienti", clientName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    docSnap.data().photos.forEach((photoRef) => {
      photoNames.push(photoRef.id);
    });
  } else {
    console.log("No such document!");
  }

  return photoNames;
};

export const saveTagsToFirebase = async (db, tagsString) => {
  try {
    const tags = tagsString.split(",");
    const batch = writeBatch(db);
    tags.forEach((tag) => {
      if (tag !== "") {
        const tagRef = doc(db, "impostazioni", "tags", "tagsFoto", tag);
        batch.set(tagRef, { name: tag });
      }
    });
    await batch.commit();
    ToastQueue.positive("Tags salvati con successo", {
      timeout: 2000,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare i tag" + error, {
      timeout: 2000,
    });
  }
};
export const getTagsFromFirebase = async (db) => {
  try {
    const tags = [];
    const querySnapshot = await getDocs(
      collection(db, "impostazioni", "tags", "tagsFoto")
    );
    querySnapshot.forEach((doc) => {
      tags.push({ id: doc.data().name, name: doc.data().name });
    });
    return tags;
  } catch (error) {
    console.error("Error getting tags from the Database: ", error);
  }
};
export const saveProductToFirebase = async (db, product) => {
  try {
    console.log(product);
    const productRef = doc(db, "prodotti", product.id);
    await setDoc(productRef, product);
    ToastQueue.positive("Prodotto salvato con successo", {
      timeout: 2000,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare il prodotto" + error, {
      timeout: 2000,
    });
  }
};

export const getProductsFromFirebase = async (db) => {
  try {
    const products = [];
    const querySnapshot = await getDocs(collection(db, "prodotti"));
    querySnapshot.forEach((doc) => {
      products.push({...doc.data(),doc:doc.ref});
    });
    return products;
  } catch (error) {
    ToastQueue.negative("Errore nel recuperare i prodotti:" + error, {
      timeout: 2000,
    });
  }
};

export const createUser = async (email, password, name, ruolo) => {
  try {
    const auth = getAuth();
    const db = getFirestore();

    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    // Create a new document in the users collection with the user's uid
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      uid: user.uid,
      displayName: name,
      ruolo: ruolo,
      permessi: [false, false, false, false, false],
      // Add any additional fields here
    });
    ToastQueue.positive("Utente creato con successo: " + user.uid, {
      timeout: 2000,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel creare l'utente" + error, {
      timeout: 2000,
    });
  }
};

export const getUsers = async () => {
  try {
    const db = getFirestore();

    // Get all documents from the users collection
    const querySnapshot = await getDocs(collection(db, "users"));

    // Create an array of user objects from the query results
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    ToastQueue.positive("Utenti recuperati con successo", {
      timeout: 1000,
    });
    return users;
  } catch (error) {
    ToastQueue.negative("Errore nel recuperare gli utenti" + error, {
      timeout: 2000,
    });
  }
};

export const getAllPostazioni = async () => {
  try {
    const db = getFirestore();
    const postazioniRef = collection(db, "postazioni");
    const postazioniSnapshot = await getDocs(postazioniRef);
    const postazioniList = postazioniSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return postazioniList;
  } catch (error) {
    ToastQueue.negative("Errore nel recuperare le postazioni" + error, {
      timeout: 2000,
    });
  }
};

export const updateUser = async (userId, data, selected) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);

    // Get the postazioni subcollection reference
    const postazioniRef = collection(userRef, "postazioni");

    // Add or remove postazione references based on the selected array
    for (const postazioneId of selected) {
      // Add a reference to the postazione in the user's postazioni subcollection
      await setDoc(doc(postazioniRef, postazioneId), {});

      // Add a staff document to the postazione's staff subcollection
      const staffRef = collection(db, "postazioni", postazioneId, "staff");
      await setDoc(doc(staffRef, userId), {
        email: data.email,
        uid: userId,
        ref: userRef,
      });
    }
    const userPostazioniSnapshot = await getDocs(postazioniRef);
    for (const postazioneDoc of userPostazioniSnapshot.docs) {
      if (!selected.includes(postazioneDoc.id)) {
        // Remove the reference to the postazione from the user's postazioni subcollection
        await deleteDoc(postazioneDoc.ref);

        // Remove the staff document from the postazione's staff subcollection
        const staffRef = doc(
          db,
          "postazioni",
          postazioneDoc.id,
          "staff",
          userId
        );
        await deleteDoc(staffRef);
      }
    }
    ToastQueue.positive("Utente aggiornato con successo", {
      timeout: 2000,
    });
  } catch (error) {
    console.error("Error updating user: ", error);
    ToastQueue.negative("Errore nell'aggiornare l'utente" + error, {
      timeout: 2000,
    });
  }
};

export const addPhotosToClients = async (
  db,
  postazioneId,
  clientNames,
  photos,
  clientInfo
) => {
  try {
    const batch = writeBatch(db);
    for (const clientName of clientNames) {
      if (clientName && clientName !== "") {
        const clientRef = doc(
          db,
          "postazioni",
          postazioneId,
          "clienti",
          clientName
        );
        const photoRefs = photos.map((photo) =>
          doc(db, "postazioni", postazioneId, "fotografie", photo.id)
        );
        const clientDoc = await getDoc(clientRef);
        if (clientDoc.exists()) {
          // La cartella esiste già
          batch.update(clientRef, {
            photos: arrayUnion(...photoRefs),
            name: clientName,
          });
        } else {
          // La cartella non esiste ancora
          batch.set(clientRef, {
            name: clientName,
            ...clientInfo,
            photos: photoRefs,
          });

          // Create the client in the main collection if it doesn't exist
          const mainClientRef = doc(db, "clienti", clientName);
          const mainClientDoc = await getDoc(mainClientRef);
          if (!mainClientDoc.exists()) {
            batch.set(mainClientRef, { name: clientName, ...clientInfo });
          }

          // Add the photos to the subcollection
          for (const photo of photos) {
            const photoRef = doc(mainClientRef, "foto", photo.id);
            batch.set(photoRef, { ...photo.data, postazione: postazioneId });
          }
        }

        // Add the client to the subcollection of the postazione document
        const postazioneClientRef = doc(
          db,
          "postazioni",
          postazioneId,
          "clienti",
          clientName
        );
        batch.set(postazioneClientRef, {
          photos: photoRefs,
          ...clientInfo,
          name: clientName,
        });
      }
    }
    await batch.commit();
    ToastQueue.positive("Foto aggiunte correttamente", {
      timeout: 2000,
    });
  } catch (error) {
    console.log(error);
    ToastQueue.negative("Errore nell'aggiungere le foto: " + error, {
      timeout: 2000,
    });
  }
};


export const finalizeSale = async (saleData) => {
  try {
    const { cliente, fotoAcquistate, postazione, tassazione, totale } =
      saleData;
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const fotografoRef = doc(db, "users", user.uid);
    const now = Timestamp.now();
    let saleRef;
    let clientRef;
    // Generate a custom ID for the new vendite document
    const postazioneRef = doc(db, "postazioni", postazione);
    const venditeSnapshot = await getDocs(collection(postazioneRef, "vendite"));
    const numeroProgressivo = venditeSnapshot.size + 1;
    const saleId = `${postazione.slice(-5)}-${numeroProgressivo}`;

    if (!cliente.clienteID) {
      // Call the addPhotosToClients function
      await addPhotosToClients(
        db,
        postazione,
        [cliente.nome],
        fotoAcquistate
      );
      // Update the client's documents
      clientRef = doc(db, "clienti", cliente.nome );
      await updateDoc(clientRef, { ...cliente });
      // Create a new document in the vendite collection with a custom ID
      saleRef = doc(db, "vendite", saleId);
      await setDoc(saleRef, {
        ...saleData,
        fotografo: fotografoRef,
        data: now,
        cliente: clientRef,
      });
      await setDoc(doc(clientRef, "vendite", saleRef.id), { ref: saleRef });
      ToastQueue.positive("Vendita Effettuata", {
        timeout: 2000,
      });
    } else {
      // Create a new document in the vendite collection with a custom ID
      clientRef = doc(db, "clienti", cliente.clienteID);
      saleRef = doc(db, "vendite", saleId);
      await setDoc(saleRef, {
        ...saleData,
        fotografo: fotografoRef,
        data: now,
        cliente: clientRef,
      });

      // Update the client's documents
      await updateDoc(clientRef, { ...cliente });

      // Add the sale to the client's vendite subcollection
      await setDoc(doc(clientRef, "vendite", saleRef.id), { ref: saleRef });

      ToastQueue.positive("Vendita Effettuata", {
        timeout: 2000,
      });
    }

    // Add the sale to the postazione's vendite subcollection
    await setDoc(doc(postazioneRef, "vendite", saleRef.id), { ref: saleRef });

    // Add the client to the postazione's clienti subcollection
    await setDoc(doc(postazioneRef, "clienti", clientRef.id), {
      ref: clientRef,
    });
  } catch (error) {
    console.error("Error finalizing sale: ", error);
    ToastQueue.negative("Error finalizing sale:" + error, {
      timeout: 2000,
    });
  }
};

export const saveTagsPostazioneToFirebase = async (db, tagsString) => {
  try {
    const tags = tagsString.split(",");
    const batch = writeBatch(db);
    tags.forEach((tag) => {
      if (tag !== "") {
        const tagRef = doc(db, "impostazioni", "tags", "tagsPostazione", tag);
        batch.set(tagRef, { name: tag });
      }
    });
    await batch.commit();
    ToastQueue.positive("Tags salvati con successo", {
      timeout: 2000,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare i tag" + error, {
      timeout: 2000,
    });
  }
};
export const deleteFolderByName = async (postazioneId, folderName) => {
  try {
    const db = getFirestore();
    const folderRef = doc(
      db,
      "postazioni",
      postazioneId,
      "cartelle",
      folderName
    );

    await deleteDoc(folderRef);

    ToastQueue.positive("Folder deleted successfully", {
      timeout: 500,
    });
  } catch (error) {
    console.log(error);
    ToastQueue.negative("Error deleting folder: " + error, {
      timeout: 1000,
    });
  }
};

export const saveTaxToFirebase = async (db, tax) => {
  try {
    const productRef = doc(db, "tasse", tax.id);
    await setDoc(productRef, tax);
    ToastQueue.positive("Tassa salvato con successo", {
      timeout: 500,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare la tassa" + error, {
      timeout: 500,
    });
  }
};
export const saveValutaToFirebase = async (valuta) => {
  const db = getFirestore()
  try {
    const productRef = doc(db, "valute", valuta.id);
    await setDoc(productRef, valuta);
    ToastQueue.positive("Valuta salvato con successo", {
      timeout: 500,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare la tassa" + error, {
      timeout: 500,
    });
  }
};

export const saveTagsToSettingsPostazione = async (tagsString, postId) => {
  try {
    console.log(tagsString, postId);
    const db = getFirestore();
    const tags = tagsString.split(",");
    const postazioneRef = doc(db, "postazioni", postId, "impostazioni", "tags");
    const docSnapshot = await getDoc(postazioneRef);
    if (docSnapshot.exists()) {
      console.log("exists");
      await updateDoc(postazioneRef, { tagDisponibili: tags });
    } else {
      console.log("not exists");
      await setDoc(postazioneRef, { tagDisponibili: tags });
    }
    ToastQueue.positive("Tags salvati con successo", {
      timeout: 500,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare i tag" + error, {
      timeout: 500,
    });
  }
};
export const saveCommissioniToSettingsPostazione = async (commissione, postId,type) => {
  try {
    const db = getFirestore();
    const postazioneRef = doc(db, "postazioni", postId, "impostazioni", "commissioni");
    const docSnapshot = await getDoc(postazioneRef);
    if (docSnapshot.exists()) {
      console.log("exists");
      await updateDoc(postazioneRef, { [type]: commissione });
    } else {
      console.log("not exists");
      await setDoc(postazioneRef, { [type]: commissione });
    }
    ToastQueue.positive("Commissione salvata con successo", {
      timeout: 500,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare i tag" + error, {
      timeout: 500,
    });
  }
};
export const saveProductsToSettingsPostazione = async (prodotti, postId) => {
  try {
    console.log(prodotti, postId);
    const db = getFirestore();
    const postazioneRef = doc(db, "postazioni", postId, "impostazioni", "prodotti");
    const docSnapshot = await getDoc(postazioneRef);
    if (docSnapshot.exists()) {
      console.log("exists");
      await updateDoc(postazioneRef, { prodotti });
    } else {
      console.log("not exists");
      await setDoc(postazioneRef, { prodotti });
    }
    ToastQueue.positive("Prodotti salvati con successo", {
      timeout: 500,
    });
  } catch (error) {
    ToastQueue.negative("Errore nel salvare i prodotti" + error, {
      timeout: 500,
    });
  }
};
export const getProductsFromSettingsPostazione = async (postId) => {
  try {
    const db = getFirestore();
    const postazioneRef = doc(db, "postazioni", postId, "impostazioni", "prodotti");
    const docSnapshot = await getDoc(postazioneRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data().prodotti;
    } else {
      console.log("No products found");
      return [];
    }
  } catch (error) {
    console.error("Error retrieving products:", error);
    return [];
  }
};
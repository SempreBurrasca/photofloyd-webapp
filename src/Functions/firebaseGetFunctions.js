import {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { ToastQueue } from "@react-spectrum/toast";
import { getAuth } from "firebase/auth";

export const getUserPostazioni = async (USER_ID) => {
  try {
    const db = getFirestore();
    const userRef = await doc(db, "users", USER_ID);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    console.log(userData);
    if (userData.permessi[0] || userData.permessi[1]) {
      // Get all postazioni
      const postazioniRef = collection(db, "postazioni");
      const postazioniSnapshot = await getDocs(postazioniRef);
      const postazioniList = postazioniSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return postazioniList;
    } else {
      // Get only the user's postazioni
      const userPostazioniRef = collection(userRef, "postazioni");
      const userPostazioniSnapshot = await getDocs(userPostazioniRef);
      const postazioniList = [];
      for (const docP of userPostazioniSnapshot.docs) {
        const postazioneRef = doc(db, "postazioni", docP.id);
        const postazioneDoc = await getDoc(postazioneRef);

        postazioniList.push({ id: postazioneDoc.id, ...postazioneDoc.data() });
      }
      ToastQueue.positive("Postazioni recuperate con successo", {
        timeout: 1000,
      });
      console.log(postazioniList);
      return postazioniList;
    }
  } catch (error) {
    console.log(error);
    ToastQueue.negative("Errore nel recuperare le postazioni " + error, {
      timeout: 2000,
    });
  }
};

export const getEdits = async (postazioneId, fotografiaId) => {
  try {
    const db = getFirestore();
    // Create a reference to the edits subcollection
    const editsRef = collection(
      db,
      "postazioni",
      postazioneId,
      "fotografie",
      fotografiaId,
      "edits"
    );

    // Get all the documents from the edits subcollection
    const querySnapshot = await getDocs(editsRef);

    // Create an array to store the documents
    const edits = [];

    // Loop through the documents and add them to the array
    querySnapshot.forEach((doc) => {
      edits.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Return the array of documents
    return edits;
  } catch (error) {
    console.error("Error getting edits:", error);
  }
};

export const getClienti = (db, postazioneId, callback) => {
  const collectionRef = collection(db, "postazioni", postazioneId, "clienti");
  const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
    const clienti = [];
    querySnapshot.forEach((doc) => {
      clienti.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    console.log("Clienti retrieved successfully");
    callback(clienti);
  });
  return unsubscribe;
};

export const getSalesByPostazione = async (postazione) => {
  const db = getFirestore();
  const sales = [];
  const postazioneRef = doc(db, "postazioni", postazione);
  const querySnapshot = await getDocs(collection(postazioneRef, "vendite"));
  for (const doc of querySnapshot.docs) {
    const saleRef = doc.data().ref;
    const saleDoc = await getDoc(saleRef);
    const saleData = saleDoc.data();
    
    // Add the sale ID
    saleData.id = saleDoc.id;
    
    // Retrieve the client data
    const clientRef = saleData.cliente;
    const clientDoc = await getDoc(clientRef);
    saleData.cliente = clientDoc.data();
    // Retrieve the fotografo data
    const fotografoRef = saleData.fotografo;
    const fotografoDoc = await getDoc(fotografoRef);
    saleData.fotografo = fotografoDoc.data();
    
    sales.push(saleData);
  }
  return sales;
};

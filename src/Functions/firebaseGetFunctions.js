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

export const getUserPostazioni = (USER_ID, callback) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", USER_ID);

    // Get user data
    getDoc(userRef).then((userDoc) => {
      const userData = userDoc.data();

      if (userData.permessi[0] || userData.permessi[1]) {
        // Listen for real-time updates to all postazioni
        const postazioniRef = collection(db, "postazioni");
        onSnapshot(postazioniRef, (postazioniSnapshot) => {
          const postazioniList = postazioniSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(postazioniList);
        });
      } else {
        // Listen for real-time updates to the user's postazioni
        const userPostazioniRef = collection(userRef, "postazioni");
        onSnapshot(userPostazioniRef, (userPostazioniSnapshot) => {
          const postazioniList = [];
          userPostazioniSnapshot.forEach((docP) => {
            const postazioneRef = doc(db, "postazioni", docP.id);
            getDoc(postazioneRef).then((postazioneDoc) => {
              postazioniList.push({
                id: postazioneDoc.id,
                ...postazioneDoc.data(),
              });
              callback(postazioniList);
            });
          });
        });
      }
    });
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
  
    // Retrieve the client data
    const clientRef = saleData.cliente;
    const clientDoc = await getDoc(clientRef);
    saleData.cliente = clientDoc.data();
    // Retrieve the fotografo data
    const fotografoRef = saleData.fotografo;
    const fotografoDoc = await getDoc(fotografoRef);
    saleData.fotografo = fotografoDoc.data();
    saleData.id=doc.id
    sales.push(saleData);
  }
  return sales;
};

export const getTagsPostazioneFromFirebase = async () => {
  try {
    const db = getFirestore();
    const tags = [];
    const querySnapshot = await getDocs(
      collection(db, "impostazioni", "tags", "tagsPostazione")
    );
    querySnapshot.forEach((doc) => {
      tags.push({ id: doc.data().name, name: doc.data().name });
    });
    return tags;
  } catch (error) {
    console.error("Error getting tags from the Database: ", error);
  }
};

export const getAllSales = (callback) => {
  const db = getFirestore();
  const unsubscribe = onSnapshot(
    collection(db, "vendite"),
    async (querySnapshot) => {
      const sales = [];
      for (const doc of querySnapshot.docs) {
        const saleDoc = doc;
        const saleData = doc.data();

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
      callback(sales);
    }
  );

  // Return the unsubscribe function so that the caller can stop listening for changes
  return unsubscribe;
};

export const getTasseDocuments = async () => {
  const db = getFirestore();
  const tasseCollection = collection(db, "tasse");
  const querySnapshot = await getDocs(tasseCollection);
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return documents;
};
export const getValuteDocuments = async () => {
  const db = getFirestore();
  const tasseCollection = collection(db, "valute");
  const querySnapshot = await getDocs(tasseCollection);
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return documents;
};

export const getTagsFromSettingsPostazione = async (postId) => {
  try {
    const db = getFirestore();
    const postazioneRef = doc(db, 'postazioni', postId, 'impostazioni', 'tags');
    const docSnapshot = await getDoc(postazioneRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const tags = data.tagDisponibili;
      return tags;
    } else {
      
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCommissioniPostazione =async (postId)=> {
  try {
    const db = getFirestore();
    const postazioneRef = doc(db, "postazioni", postId, "impostazioni", "commissioni");
    const docSnapshot = await getDoc(postazioneRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      throw new Error("Commissioni document does not exist");
    }
  } catch (error) {
    console.error("Error retrieving commissioni document:", error);
    throw error;
  }
}
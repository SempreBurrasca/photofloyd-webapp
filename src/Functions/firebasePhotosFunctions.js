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
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const saveEditedPhoto = async (
  postazioneId,
  activeFotoId,
  imageObject,
  designState
) => {
  try {
    const db = getFirestore();
    // Create a reference to the edits subcollection
    const editsRef = collection(
      db,
      "postazioni",
      postazioneId,
      "fotografie",
      activeFotoId,
      "edits"
    );

    // Set the document data
    const docData = {
      name: imageObject.name,
      uid: imageObject.fullName,
      url: "https://www.photofloyd.cloud/app/upload/" + imageObject.fullName,
      //designState: designState,
      timestamp: Timestamp.now(),
      // Add any additional data here
    };

    // Save the document to the Firestore database
    await setDoc(doc(editsRef, imageObject.fullName), docData);

    console.log("Photo saved successfully");
    ToastQueue.positive("Versione salvata con successo", {
      timeout: 1000,
    });
  } catch (error) {
    console.error("Error saving photo:", error);
    ToastQueue.negative("Errore nel salvare la versione della fotografia", {
      timeout: 1000,
    });
  }
};


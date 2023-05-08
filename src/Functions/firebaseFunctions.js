import { ToastQueue } from "@react-spectrum/toast";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const savePhotosToFirebase = async (db, photos, postazioneId) => {
  try {
    console.log(photos);
    const batch = writeBatch(db);
    const auth = getAuth();
    const user = auth.currentUser;
    photos.photos.forEach((photo) => {
      const photoRef = doc(
        db,
        "postazioni",
        postazioneId,
        "fotografie",
        photo.name
      );
      batch.set(photoRef, {
        name: photo.name,
        url: "https://www.photofloyd.cloud/app/upload/" + photo.name,
        tags: photo.tags,
        label: " ",
        fotografo: {
          nome: user.displayName && user.displayName,
          uid: user.uid,
        },
      });
    });
    if (photos.folders && photos.folders.length > 0) {
      photos.folders.forEach((folder) => {
        const folderRef = doc(
          db,
          "postazioni",
          postazioneId,
          "cartelle",
          folder.name
        );
        batch.set(folderRef, {
          name: folder.name,
          label: " ",
          tags: folder.tags,
          photos: folder.images.map((photoName) =>
            doc(db, "postazioni", postazioneId, "fotografie", photoName.name)
          ),
        });
      });
    }
    await batch.commit();
    ToastQueue.positive("Foto salvate con successo nel Database", {
      timeout: 2000,
    });
  } catch (error) {
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
      const photoRef = doc(db, "postazioni", postazioneId, "fotografie", photo.id);
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
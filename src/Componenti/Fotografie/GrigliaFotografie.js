import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Flex,
  View,
  Well,
  Image,
  Heading,
  Divider,
  ActionButton,
  Button,
  DialogContainer,
} from "@adobe/react-spectrum";
import { collection, onSnapshot } from "firebase/firestore";
import { ToastQueue } from "@react-spectrum/toast";
import CardFoto from "./CardFoto";
import { StateContext } from "../../Context/stateContext";
import { filterPhotos } from "../../Functions/filterFunctions";
import DialogWatermark from "../../Routes/Postazione/DialogWatermark";
function GrigliaFotografie(props) {
  const { state, dispatch } = useContext(StateContext);
  const { isEditMode, selectedFotos, setSelectedFotos, filteredPhotos } = props;
  const [fotografie, setFotografie] = useState([]);
  const [visibleFotografie, setVisibleFotografie] = useState([]);
  const [isOpen, setOpen] = React.useState(false);
  const observer = useRef(null);

  //recupero e imposto le foto della postazione la prima volta
  useEffect(() => {
    setSelectedFotos([]);
    if (state.fotoPostazione.length === 0) {
      getFotografie();
    } else {
      setFotografie(state.fotoPostazione);
    }
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleFotografie((prevVisible) => [
              ...prevVisible,
              entry.target.dataset.id,
            ]);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [state.fotoPostazione]);
  //applico i filtri
  useEffect(() => {
    console.log(state);
    if (
      !state.filters.client &&
      !state.filters.data &&
      !state.filters.fotografo &&
      !state.filters.label &&
      !state.filters.tags
    ) {
      setFotografie(state.fotoPostazione);
      console.log("reset filtri");
    } else {
      setFotografie(filterPhotos(state.fotoPostazione, state.filters));
      console.log("applico i filtri");
    }
  }, [state.filters]);

  //recupero le fotografie
  const getFotografie = () => {
    const collectionRef = collection(
      props.db,
      "postazioni",
      props.postazioneId,
      "fotografie"
    );
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      var arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      if (arr.length > 0) {
        dispatch({ type: "SET_FOTO_POSTAZIONE", fotoPostazione: arr });
        ToastQueue.positive(
          "Recuperate " + arr.length + " fotografie con successo",
          { timeout: 200 }
        );
      }
    });
    return unsubscribe;
  };

  //seleziono una singola foto
  const handleSelectFoto = (foto) => {
    if (selectedFotos.includes(foto)) {
      setSelectedFotos((prevSelected) =>
        prevSelected.filter((item) => item !== foto)
      );
    } else {
      setSelectedFotos((prevSelected) => [...prevSelected, foto]);
    }
  };

  //seleziono tutte le foto presenti in griglia
  const selectAllFoto = () => {
    setSelectedFotos(fotografie);
    console.log(selectedFotos);
  };
  //deseleziono le foto
  const DeselectAllFoto = () => {
    setSelectedFotos([]);
    console.log(selectedFotos);
  };

  return (
    <View padding="size-100" overflow="auto" height="55vh">
      <Flex gap={"size-100"} marginY={10}>
        <ActionButton onPress={selectAllFoto}>Seleziona Tutto</ActionButton>
        <ActionButton
          onPress={DeselectAllFoto}
          isDisabled={selectedFotos.length < 1}
        >
          Deseleziona Tutto
        </ActionButton>
        <Divider orientation="vertical" size="S" />
        <Button
          variant="accent"
          isDisabled={selectedFotos.length < 1}
          onPress={() => setOpen(true)}
        >
          Crea Collezione Watermark
        </Button>
      </Flex>
      <Flex
        alignItems="start"
        justifyContent="start"
        gap="size-150"
        wrap
        direction="row"
      >
        {fotografie.length === 0 && (
          <Well>
            Non sono presenti fotografie, caricale ora oppure cambia i filtri.
          </Well>
        )}

        {fotografie.map((foto) => (
          <div
            key={foto.id}
            data-id={foto.id}
            ref={(el) => el && observer.current.observe(el)}
          >
            {visibleFotografie.includes(foto.id) && (
              <CardFoto
                isSelectedMode={false}
                fotoToEdit={props.fotoToEdit}
                setFotoToEdit={props.setFotoToEdit}
                foto={foto}
                display={
                  filteredPhotos.length > 0
                    ? filteredPhotos.includes(foto.id)
                    : true
                }
                handleSelectFoto={handleSelectFoto}
                selectedFotografie={selectedFotos}
                db={props.db}
                postazioneId={props.postazioneId}
              />
            )}
          </div>
        ))}
      </Flex>
      <DialogContainer
        onDismiss={() => setOpen(false)}
        {...props}
        type="fullscreen"
      >
        {isOpen && (
          <DialogWatermark
            close={() => setOpen(false)}
            selectedFotos={selectedFotos}
          />
        )}
      </DialogContainer>
    </View>
  );
}

export default GrigliaFotografie;

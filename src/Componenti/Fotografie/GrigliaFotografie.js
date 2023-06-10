import React, { useState, useEffect, useRef, useContext } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { Flex, View, Well } from "@adobe/react-spectrum";

import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { ToastQueue } from "@react-spectrum/toast";

import CardFoto from "./CardFoto";
import { StateContext } from "../../Context/stateContext";
import {
  clientFilter,
  filterPhotos,
  tagsFilter,
} from "../../Functions/filterFunctions";
import { CalendarDate } from "@internationalized/date";
function GrigliaFotografie(props) {
  const { state, dispatch } = useContext(StateContext);
  const setSelectedFotos = props.setSelectedFotos;
  let selectedFotos = props.selectedFotos;
  const [fotografie, setFotografie] = useState([]);
  const [visibleFotografie, setVisibleFotografie] = useState([]);
  const observer = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const filteredPhotos = props.filteredPhotos;

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

  useEffect(() => {
    if (state.filters.label) {
      setFotografie(filterPhotos(state.fotoPostazione, state.filters));
    } else {
      setFotografie(filterPhotos(state.fotoPostazione, state.filters));
    }
    console.log(state.filters);
  }, [state.filters]);
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

  const handleSelectFoto = (foto) => {
    if (selectedFotos.includes(foto)) {
      setSelectedFotos((prevSelected) =>
        prevSelected.filter((item) => item !== foto)
      );
      console.log(foto, selectedFotos);
    } else {
      setSelectedFotos((prevSelected) => [...prevSelected, foto]);
      console.log(foto, selectedFotos);
    }
  };

  return (
    <View padding="size-100" overflow="auto" height="55vh">
      <Flex
        alignItems="start"
        justifyContent="start"
        gap="size-150"
        wrap
        direction="row"
      >
        {fotografie.length === 0 && (
          <Well>
            Non sono state ancora caricate le fotografie, caricale ora
            utilizzando il pulsante in alto a destra.
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
                fotoToEdit={props.fotoToEdit}
                setFotoToEdit={props.setFotoToEdit}
                setOpenEditDialog={props.setOpenEditDialog}
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
    </View>
  );
}

export default GrigliaFotografie;

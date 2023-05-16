import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { Flex, View } from "@adobe/react-spectrum";

import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { ToastQueue } from "@react-spectrum/toast";

import CardFoto from "./CardFoto";

function GrigliaFotografie(props) {
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
    getFotografie();
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
  }, []);

  const getFotografie = () => {
    console.log(props.db, "postazioni", props.postazioneId, "fotografie");
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
      setFotografie(arr);
      if (arr.length > 0) {
        ToastQueue.positive(
          "Recuperate " + arr.length + " fotografie con successo",
          { timeout: 2000 }
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
    <View padding="size-200" overflow="auto" height="60vh">
      <Flex
        alignItems="start"
        justifyContent="start"
        gap="size-150"
        wrap
        direction="row"
      >
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

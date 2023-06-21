import React, { useState, useEffect, useRef, useContext } from "react";
import { Flex, View, Well, Image, Heading, Divider } from "@adobe/react-spectrum";
import { collection, onSnapshot } from "firebase/firestore";
import { ToastQueue } from "@react-spectrum/toast";
import CardFoto from "./CardFoto";
import { StateContext } from "../../Context/stateContext";
import { filterPhotos } from "../../Functions/filterFunctions";
function GrigliaFotografie(props) {
  const { state, dispatch } = useContext(StateContext);
  const{ isEditMode,selectedFotos,setSelectedFotos,filteredPhotos} = props
  const [fotografie, setFotografie] = useState([]);
  const [visibleFotografie, setVisibleFotografie] = useState([]);
  const observer = useRef(null);

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
  }, [state.filters]);
  useEffect(() => {
    console.log(selectedFotos);
  }, [selectedFotos]);
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
    } else {
      setSelectedFotos((prevSelected) => [...prevSelected, foto]);
    }
  };

  return (
    <View padding="size-100" overflow="auto" height="55vh">
      <Flex direction={"column"} margin={15} alignItems={"stretch"} justifyContent={"start"}>
        <Flex gap={"size-100"}>
        {selectedFotos.length > 0 && (
          <Flex direction={"column"} flex={1} gap="size-100">
            <Heading level={4}>Filtri e Modifica</Heading>
            <View backgroundColor={"blue-400"} width={"100%"} height={"50px"}></View>
            <View backgroundColor={"blue-400"} width={"100%"} height={"50px"}></View>
            <View backgroundColor={"blue-400"} width={"100%"} height={"50px"}></View>
            <View backgroundColor={"blue-400"} width={"100%"} height={"50px"}></View>
          </Flex>
        )}
        {selectedFotos.length > 0 && (
          <Flex flex={2} justifyContent={"center"}>
          <Image
            src={selectedFotos[0].data.url}
            alt="dsadasdas"
            objectFit="contain"
            width="auto"
            height="35vh"
          />
          </Flex>
        )}
        </Flex>
        {selectedFotos.length > 0 && (
          <View maxWidth={"100%"} overflow={"auto"} margin={10}>
            <Flex gap={"size-100"} maxWidth={"100%"}  overflow={"auto"} >
              {selectedFotos.map((f) => (
                <View>
                <Image
                  src={f.data.url}
                  alt="dsadasdas"
                  objectFit="cover"
                  width="150px"
                  height="120px"
            
                />
                </View>
              ))}
            </Flex>
          </View>
        )}
        <Divider size="M"/>
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
                isSelectedMode={selectedFotos.length > 0 ? true : false}
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

import React, { useEffect } from "react";

import {
  AlertDialog,
  DialogContainer,
  Flex,
  Image,
  View,
} from "@adobe/react-spectrum";

function SelectedFotosCarousel(props) {
  const {
    activeFoto,
    setActiveFoto,
    selectedFotos,
    setFilter,
    isSaved,
    setIsSaved,
  } = props;
  let [isOpen, setOpen] = React.useState(false);
  useEffect(() => {}, [activeFoto]);

  const handleClick = (foto) => {
    //impostare il check se foto
    if (foto.id === activeFoto.id) {
      //la foto è la stessa
    } else {
      //la foto è differente e quindi va cambiata
      //controlla se le modifiche sono state salvate
      //cambia foto
      if (!isSaved) {
        setOpen(true);
      } else {
        setActiveFoto(foto);
        setFilter("none");
      }
    }
  };
  const handleCancel=()=>{
    setOpen(false)
  }
  const handleSave=(foto)=>{
    console.log("salva e continua")
    setActiveFoto(foto);
    setFilter("none");
    setOpen(false)
  }
  const handleContinue=(foto)=>{
    console.log("non salvare e continua")
    setActiveFoto(foto);
    setFilter("none");
    setOpen(false)
  }
  return (
    <Flex gap={"size-100"} direction={"row"}>
      {/*
            Qui andranno le immagini selezionate con l'enfasi su quella attiva
            */}
      {selectedFotos &&
        selectedFotos.map((foto) => (
          <div
            key={foto.id + "-gallery"}
            style={{ cursor: "pointer" }}
            onClick={() => handleClick(foto)}
          >
            <View
              backgroundColor={foto.id === activeFoto.id ? "blue-400" : ""}
              flexShrink={0}
              padding={"size-100"}
            >
              <Image
                src={foto.data.url}
                alt={foto.id}
                objectFit="cover"
                height={"100px"}
                width={"100px"}
              />
               <DialogContainer onDismiss={() => setOpen(false)} {...props}>
        {isOpen && (
          <AlertDialog
            variant="confirmation"
            title="Modifiche non salvate"
            primaryActionLabel="Salva e continua"
            secondaryActionLabel="Continua senza salvare"
            cancelLabel="Annulla"
            onCancel={()=>handleCancel(foto)}
            onPrimaryAction={()=>handleSave(foto)}
            onSecondaryAction={()=>handleContinue(foto)}
          >
            Non hai ancora salvato le modifiche alla foto. Sicuro di voler
            continuare?
          </AlertDialog>
        )}
      </DialogContainer>
            </View>
          </div>
        ))}
     
    </Flex>
  );
}

export default SelectedFotosCarousel;

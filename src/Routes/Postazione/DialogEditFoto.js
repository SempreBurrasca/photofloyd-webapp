import React, { useState, useEffect } from "react";

import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
  View,
} from "@adobe/react-spectrum";

import PhotofloydCanvas from "../../Organismi/PhotofloydCanvas/PhotofloydCanvas";
import SelectedFotosCarousel from "../../Organismi/PhotofloydCanvas/SelectedFotosCarousel";
import Crop from "@spectrum-icons/workflow/Crop";
import c_o from "../../asset/cornici/cornice_oriz.png"
import c_v from "../../asset/cornici/cornice_vert.png"
import c_vt from "../../asset/cornici/corniceTest_vert.png"
function DialogEditFoto(props) {
  const { close, fotoToEdit, db, postazioneId, selectedFotos } = props;
  const [activeFoto, setActiveFoto] = useState(selectedFotos[0]);
  const [update, setUpdate] = useState(0);
  const [filter, setFilter] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [saveNow,setSaveNow]=useState(false)
  const [isCornice,setIsCornice]=useState(false)
  const [cornice,setCornice]=useState(false)
  useEffect(() => {}, [activeFoto]);

  return (
    //CAMBIARE DIALOG CON DIALOG CONTAINER
    <Dialog size="L" type="fullscreen">
      <Heading>Editing Foto</Heading>
      <Divider />
      <Content>
        <Flex direction={"column"} gap={"size-125"}>
          <Flex gap={"size-125"} flex={3} >
            <View flex={1} height={"60vh"} flexShrink={0}>
              <Flex direction={"column"} gap={"size-100"}>
                {/*Qui andranno i preset e i comandi di editing*/}
                <Text>Filtri</Text>
                <ActionButton onPress={() => setFilter("grayscale(100%)")}>
                  Grayscale
                </ActionButton>
                <ActionButton onPress={() => setFilter("seppia")}>
                  Sepia
                </ActionButton>
                <ActionButton onPress={() => setFilter("invert(100%)")}>
                  Invert
                </ActionButton>
                <ActionButton
                  onPress={() => {
                    setFilter("none");
                    setUpdate(update + 1);
                  }}
                >
                  Originale
                </ActionButton>
                <Divider size="S" />
                <Text>Altre Modifiche</Text>
                {cropping ? (
                  <ActionButton
                    onPress={() => {
                      setCropping(false);
                    }}
                  >
                    Fine Crop
                  </ActionButton>
                ) : (
                  <ActionButton
                    onPress={() => {
                      setCropping(true);
                    }}
                    
                  >
                    <Crop />
                    Crop
                  </ActionButton>
                )}
                <ActionButton onPress={()=>{setIsCornice(!isCornice)}}>
                  Cornici
                </ActionButton>
                {
                  isCornice&&
                  <View overflow={"auto"} width={"size-2400"} >
                    <Flex gap={"size-100"}>
                      {
                        //mettere bottone no cornice
                      }
                      <div className="button-cornice" onClick={()=>setCornice(c_o)}><View flexShrink={0}><Image src={c_o} width={100} height={100} objectFit={"contain"}/></View></div>
                      <div className="button-cornice" onClick={()=>setCornice(c_v)} ><View flexShrink={0}><Image src={c_v} width={100} height={100} objectFit={"contain"}/></View></div>
                      <div className="button-cornice" onClick={()=>setCornice(c_o)} ><View flexShrink={0}><Image src={c_o} width={100} height={100} objectFit={"contain"}/></View></div>
                      <div className="button-cornice" onClick={()=>setCornice(c_vt)}><View flexShrink={0}><Image src={c_v} width={100} height={100} objectFit={"contain"}/></View></div>
                      <div className="button-cornice" onClick={()=>setCornice(c_o)}><View flexShrink={0}><Image src={c_o} width={100} height={100} objectFit={"contain"}/></View></div>
                      <div className="button-cornice" onClick={()=>setCornice(c_v)}><View flexShrink={0}><Image src={c_v} width={100} height={100} objectFit={"contain"}/></View></div>
                    </Flex>
                  </View>
                }
                <ActionButton>
                  Aggiungi Testo
                </ActionButton>
                <ActionButton isDisabled>
                  Watermark
                </ActionButton>
                <Divider size="S" />
                <Button variant="cta" onPress={()=>setSaveNow(true)}>Salva</Button>
              </Flex>
            </View>
            <Divider size="S" orientation="vertical" />
            {/*Qui andrà l'immagine principale in edi*/}
            <View flex={4} height={"60vh"} id="canv-container">
              <PhotofloydCanvas
                imageUrl={activeFoto.data.url}
                update={update}
                filter={filter}
                activeFoto={activeFoto}
                isSaved={isSaved}
                setIsSaved={setIsSaved}
                cropping={cropping}
                setCropping={setCropping}
                saveNow={saveNow}
                setSaveNow={setSaveNow}
                cornice={cornice}
                setCornice={setCornice}
              />
            </View>
          </Flex>
          <Divider size="S" />
          <View overflow={"auto"}>
            <SelectedFotosCarousel
              activeFoto={activeFoto}
              setActiveFoto={setActiveFoto}
              selectedFotos={selectedFotos}
              setFilter={setFilter}
              isSaved={isSaved}
              setIsSaved={setIsSaved}
            />
          </View>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Indietro
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default DialogEditFoto;

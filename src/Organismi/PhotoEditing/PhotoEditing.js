import React, { useState, useEffect } from "react";

import { Flex } from "@adobe/react-spectrum";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";
import { uploadSingleImage } from "../../Functions/uploadFileToServer";
import { makeId } from "../../Functions/logicArray";
import { act } from "react-dom/test-utils";
import { saveEditedPhoto } from "../../Functions/firebasePhotosFunctions";

function PhotoEditing(props) {
  const {
    activeFoto,
    postazioneId,
    editedFoto,
    cartFotos,
    setActiveFoto,
    setEditedFoto,
    setCartFotos,
    close,
  } = props;

  useEffect(() => {}, []);

  const handleUpload = async (imageObject, designState) => {
    // Call the uploadSingleImage function to upload the file

    uploadSingleImage(imageObject)
      .then((data) => {
        saveEditedPhoto(postazioneId, activeFoto.id, imageObject, designState);
        close()
      })
      .catch((error) => {
        console.error("Error uploading photo", error);
      });
  };

  return (
    <Flex direction={"column"} gap={"size-125"} height={"100%"}>
      <FilerobotImageEditor
        source={activeFoto.data.url}
        onSave={(editedImageObject, designState) =>
          handleUpload(editedImageObject, designState)
        }
        onClose={close}
        defaultSavedImageName={"V-" + makeId(3) + "-" + activeFoto.id}
        annotationsCommon={{
          fill: "#ff0000",
        }}
        Text={{ text: "Photofloyd..." }}
        Rotate={{ angle: 90, componentType: "slider" }}
        Crop={{
          presetsItems: [
            {
              titleKey: "classicTv",
              descriptionKey: "4:3",
              ratio: 4 / 3,
              // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
            },
            {
              titleKey: "cinemascope",
              descriptionKey: "21:9",
              ratio: 21 / 9,
              // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
            },
          ],
          presetsFolders: [
            {
              titleKey: "socialMedia", // will be translated into Social Media as backend contains this translation key
              // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
              groups: [
                {
                  titleKey: "facebook",
                  items: [
                    {
                      titleKey: "profile",
                      width: 180,
                      height: 180,
                      descriptionKey: "fbProfileSize",
                    },
                    {
                      titleKey: "coverPhoto",
                      width: 820,
                      height: 312,
                      descriptionKey: "fbCoverPhotoSize",
                    },
                  ],
                },
              ],
            },
          ],
        }}
        tabsIds={[
          TABS.ADJUST,
          TABS.RESIZE,
          TABS.FINETUNE,
          TABS.FILTERS,
          TABS.ANNOTATE,
          TABS.WATERMARK,
        ]} // or {['Adjust', 'Annotate', 'Watermark']}
        defaultTabId={TABS.ANNOTATE} // or 'Annotate'
        defaultToolId={TOOLS.TEXT} // or 'Text'
      />
    </Flex>
  );
}

export default PhotoEditing;

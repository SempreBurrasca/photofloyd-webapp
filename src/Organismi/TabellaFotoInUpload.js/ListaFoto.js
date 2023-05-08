import React, { useState, useEffect } from "react";
import {
  ActionButton,
  Button,
  Flex,
  Heading,
  Image,
  Item,
  ListView,
  Text,
  TextField,
  Picker,
  useAsyncList,
  View,
  Divider,
} from "@adobe/react-spectrum";
import {
  getImagesFromIndexedDB,
  loadImagesFromIndexedDB,
} from "../../Functions/IndexedDB";
import Folder from "@spectrum-icons/workflow/Folder";
import { TagGroup } from "@react-spectrum/tag";
import { makeId } from "../../Functions/logicArray";
import { getImagesFromFileInput } from "../../Functions/uploadFileToServer";
import { containsObject } from "../../Functions/tools";

function ListaFoto(props) {
  const [listPhotos, setList] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [foldersCreated, setFoldersCreated] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTagsFoto, setSelectedTagsFoto] = useState([]);
  const availableTags = [
    { id: 1, name: "Tag1" },
    { id: 2, name: "Tag2" },
    { id: 3, name: "Tag3" },
  ];
  React.useEffect(() => {
    document.querySelector("#files").addEventListener("change", (event) => {
      getImagesFromFileInput("#files")
        .then((images) => {
          console.log(images);
          setList(images);
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    });
  }, []);

  const aggiungiCartella = () => {
    const selectedImages = listPhotos.filter((image) =>
      selectedKeys.has(image.name)
    );
    setFoldersCreated(
      foldersCreated.concat({
        name: folderName,
        images: selectedImages,
        tags: selectedTags,
      })
    );
    setSelectedKeys([]);
  };
  //manca da completare la logica che impedisca duplicati
  const aggiungiTagFoto = (item) => {
    setSelectedTagsFoto(selectedTagsFoto.concat({ id: item, name: item }));
  };

  const aggiungiTagListPhotos = async () => {
    if (selectedKeys.size === 1) {
      const fotoName = Array.from(selectedKeys)[0];
      console.log("Lista foto senza tag=>", listPhotos);
      await setList((prevList) =>
        prevList.map((foto) =>
          foto.name === fotoName ? { ...foto, tags: selectedTagsFoto } : foto
        )
      );
    }
  };

  //manca da completare la logica che impedisca duplicati
  const aggiungiTag = (item) => {
    setSelectedTags(selectedTags.concat({ id: item, name: item }));
  };
  //manca da completare la logica di rimozione del tag
  const rimuoviItem = (item) => {
    console.log(item);
  };
  const aggiungiTagFolders = () => {
    if (selectedFolders.size === 1) {
      const folderName = Array.from(selectedFolders)[0];
      console.log(folderName);
      setFoldersCreated((prevFoldersCreated) =>
        prevFoldersCreated.map((folder) =>
          folder.name === folderName
            ? { ...folder, tags: selectedTags }
            : folder
        )
      );
    }
    setSelectedFolders([]);
    setSelectedTags([]);
    console.log(foldersCreated);
  };

  const preparaUpload = () => {
    props.callSetFilesToUpload({
      photos: listPhotos,
      folders: foldersCreated,
    });
  };
  return (
    <Flex direction="column" gap={"size-100"}>
      <ActionButton
        onPress={() => {
          setSelectedKeys([]);
          setSelectedFolders([]);
        }}
      >
        Deseleziona tutto
      </ActionButton>
      <ListView
        selectionMode="multiple"
        aria-label="Async loading ListView example"
        height="size-3000"
        items={listPhotos}
        selectedKeys={selectedKeys}
        onSelectionChange={(selection) => {
          setSelectedKeys(selection);
          console.log(selectedKeys);
        }}
      >
        {(item) => (
          <Item key={item.name}>
            <Image src={item.url} alt="Shiba Inu with glasses" />
            <Text>{item.name}</Text>
          </Item>
        )}
      </ListView>
      {selectedKeys.size > 0 && (
        <Text>{selectedKeys.size} foto selezionate.</Text>
      )}
      {selectedKeys.size > 0 && (
        <Flex direction={"column"} gap="size-100">
          <Text level={5}>Aggiungi i Tag alle foto selezionate</Text>

          <TagGroup
            items={availableTags}
            label="Tag"
            aria-label="Tag selezionabili per la fotografie"
          >
            {(item) => (
              <Item key={item.id}>
                <a
                  className={containsObject(selectedTagsFoto,{
                    id:item.name,
                    name:item.name
                  })?"tag-button active":"tag-button"}
     
                  onClick={() => aggiungiTagFoto(item.name)}
                >
                  {item.name}
                </a>
              </Item>
            )}
          </TagGroup>
          
          <ActionButton onPress={() => aggiungiTagListPhotos().then(()=>{
                setSelectedTagsFoto([]);
                console.log("Lista foto con tag=>", listPhotos);
          })}>
            Aggiungi Tag
          </ActionButton>
        </Flex>
      )}
      {selectedKeys.size > 0 && (
        <Flex direction="row" gap="size-200" alignItems="end">
          <TextField
            label="Nome Cartella"
            flex={2}
            value={folderName}
            onChange={setFolderName}
          />

          <ActionButton flex={1} onPress={aggiungiCartella}>
            Crea Cartella
          </ActionButton>
        </Flex>
      )}
      {foldersCreated.length > 0 && (
        <ListView
          aria-label="Folders ListView"
          selectionStyle="highlight"
          selectionMode="multiple"
          selectedKeys={selectedFolders}
          onSelectionChange={(selection) => {
            setSelectedFolders(selection);
            console.log(selectedKeys);
          }}
          items={foldersCreated}
        >
          {(folder) => (
            <Item key={folder.name} textValue={folder.name}>
              <Folder />
              <Text>{folder.name}</Text>
              <Text slot="description">
                {folder.images.length} foto |{" "}
                {folder.images.map((image) => image.name).join(", ")}
              </Text>
            </Item>
          )}
        </ListView>
      )}
      {selectedFolders.size > 0 && (
        <Flex direction={"column"} gap="size-100">
          <Text level={5}>Aggiungi i Tag alla cartella selezionata</Text>

          <TagGroup
            items={availableTags}
            label="Tag"
            aria-label="Tag selezionabili per la postazione"
          >
            {(item) => (
              <Item key={item.id}>
                <a
                  className="tag-button"
                  onClick={() => aggiungiTag(item.name)}
                >
                  {item.name}
                </a>
              </Item>
            )}
          </TagGroup>
          {selectedTags.length > 0 && (
            <TagGroup
              items={selectedTags}
              label="Tag Selezionati"
              aria-label="Tag selezionabili per la postazione"
              allowsRemoving
              onRemove={rimuoviItem}
            >
              {(item, index) => (
                <Item key={item.id + "-" + makeId(3)}>{item.name}</Item>
              )}
            </TagGroup>
          )}
          <ActionButton onPress={() => aggiungiTagFolders()}>
            Aggiungi Tag
          </ActionButton>
        </Flex>
      )}
      <Divider size="M" />
      <ActionButton onPress={preparaUpload}>
        Prepara per l'upload {listPhotos.length} foto
        {foldersCreated.size > 0
          ? " e " + foldersCreated.size + " cartelle"
          : " e nessuna cartella"}
      </ActionButton>
    </Flex>
  );
}

export default ListaFoto;

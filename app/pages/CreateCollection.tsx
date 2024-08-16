"use client";
import { useUserStore } from "#/store/auth";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ENDPOINTS } from "#/api/config";
import {
  Card,
  Button,
  Checkbox,
  TextInput,
  Textarea,
  FileInput,
  Label,
} from "flowbite-react";

export const CreateCollectionPage = () => {
  const userStore = useUserStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [edit, setEdit] = useState(false);

  const [imageData, setImageData] = useState<string>(null);
  const [imageUrl, setImageUrl] = useState<string>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState({
    title: "",
    description: "",
  });
  const [stringLength, setStringLength] = useState({
    title: 0,
    description: 0,
  });

  const collection_id = searchParams.get("id") || null;
  const mode = searchParams.get("mode") || null;

  useEffect(() => {
    async function _checkMode() {
      if (mode === "edit" && collection_id) {
        const res = await fetch(
          `${ENDPOINTS.collection.base}/${collection_id}?token=${userStore.token}`
        );
        const data = await res.json();

        if (
          mode === "edit" &&
          userStore.user.id == data.collection.creator.id
        ) {
          setEdit(true);
        }
      }
    }
    if (userStore.user) {
      _checkMode();
    }
  }, [userStore.user]);

  const handleFileRead = (e, fileReader, type) => {
    const content = fileReader.result;
    if (type === "URL") {
      setImageUrl(content);
    } else {
      setImageData(content);
    }
  };

  const handleFilePreview = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      handleFileRead(e, fileReader, "URL");
    };
    fileReader.readAsDataURL(file);
  };

  const handleFileLoad = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      handleFileRead(e, fileReader, "TEXT");
    };
    fileReader.readAsText(file);
  };

  function handleInput(e) {
    const regex = /[^a-zA-Zа-яА-Я0-9_.,:()!? \[\]]/g;
    setCollectionInfo({
      ...collectionInfo,
      [e.target.name]: e.target.value.replace(regex, ""),
    });
    setStringLength({
      ...stringLength,
      [e.target.name]: e.target.value.replace(regex, "").length,
    });
  }

  function submit(e) {
    e.preventDefault();

    console.log(collectionInfo.title.length);

    console.log({
      ...collectionInfo,
      private: isPrivate,
      image: imageData,
    });
  }

  return (
    <main className="container pt-2 pb-16 mx-auto sm:pt-4 sm:pb-0">
      <Card>
        <p className="text-xl font-bold">
          {edit ? "Редактирование коллекции" : "Создание коллекции"}
        </p>
        <form
          className="flex flex-wrap items-center w-full gap-2"
          onSubmit={(e) => submit(e)}
        >
          <Label
            htmlFor="dropzone-file"
            className="flex flex-col items-center w-[600px] h-[337px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center w-[595px] h-[inherit] rounded-[inherit] pt-5 pb-6 overflow-hidden">
              {!imageUrl ? (
                <>
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Нажмите для загрузки</span>{" "}
                    или перетащите файл
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG или JPG (Макс. 600x337 пикселей)
                  </p>
                </>
              ) : (
                <img
                  src={imageUrl}
                  className="object-cover w-[inherit] h-[inherit]"
                />
              )}
            </div>
            <FileInput
              id="dropzone-file"
              className="hidden"
              accept="image/jpg, image/jpeg, image/png"
              onChange={(e) => {
                handleFilePreview(e.target.files[0]);
                handleFileLoad(e.target.files[0]);
              }}
            />
          </Label>
          <div className="flex-1">
            <div className="block mb-2">
              <Label
                htmlFor="title"
                value="Название (минимум 10, максимум 60 символов)"
              />
            </div>
            <TextInput
              id="title"
              name="title"
              type="text"
              sizing="md"
              className="w-full"
              required={true}
              onChange={(e) => handleInput(e)}
              value={collectionInfo.title}
              maxLength={60}
            />
            <p className="text-sm text-gray-500 dark:text-gray-300">{stringLength.title}/60</p>
            <div className="block mt-2 mb-2">
              <Label
                htmlFor="description"
                value="Описание (максимум 1000 символов)"
              />
            </div>
            <Textarea
              rows={4}
              id="description"
              className="w-full"
              name="description"
              onChange={(e) => handleInput(e)}
              value={collectionInfo.description}
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 dark:text-gray-300">{stringLength.description}/1000</p>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <Checkbox
                  id="private"
                  name="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <Label htmlFor="private" value="Приватная коллекция" />
              </div>
            </div>
            <Button color={"blue"} className="mt-4" type="submit">
              {edit ? "Обновить" : "Создать"}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
};

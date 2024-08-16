"use client";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useUserStore } from "#/store/auth";
import { useEffect, useState, useCallback } from "react";
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
  Modal,
} from "flowbite-react";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { ReleaseLink } from "#/components/ReleaseLink/ReleaseLink";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      `An error occurred while fetching the data. status: ${res.status}`
    );
    error.message = await res.json();
    throw error;
  }

  return res.json();
};

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
  const [addedReleases, setAddedReleases] = useState([]);
  const [addedReleasesIds, setAddedReleasesIds] = useState([]);
  const [releasesEditModalOpen, setReleasesEditModalOpen] = useState(false);

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

  function _deleteRelease(release: any) {
    let releasesArray = [];
    let idsArray = [];

    for (let i = 0; i < addedReleases.length; i++) {
      if (addedReleases[i].id != release.id) {
        releasesArray.push(addedReleases[i]);
        idsArray.push(addedReleasesIds[i]);
      }
    }

    setAddedReleases(releasesArray);
    setAddedReleasesIds(idsArray);
  }

  return (
    <main className="container pt-2 pb-16 mx-auto sm:pt-4 sm:pb-0">
      <Card>
        <p className="text-xl font-bold">
          {edit ? "Редактирование коллекции" : "Создание коллекции"}
        </p>
        <form
          className="flex flex-col w-full gap-2 lg:items-center lg:flex-row"
          onSubmit={(e) => submit(e)}
        >
          <Label
            htmlFor="dropzone-file"
            className="flex flex-col items-center w-full sm:max-w-[600px] h-[337px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center max-w-[595px] h-[inherit] rounded-[inherit] pt-5 pb-6 overflow-hidden">
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
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {stringLength.title}/60
            </p>
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
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {stringLength.description}/1000
            </p>
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
      <div className="mt-4">
        <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
          <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
            {"Релизов в коллекции: " + addedReleases.length}/100
          </h1>
          <Button
            color={"blue"}
            size={"xs"}
            onClick={() => setReleasesEditModalOpen(!releasesEditModalOpen)}
          >
            Добавить
          </Button>
        </div>
        <div className="m-4">
          <div className="grid justify-center sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] grid-cols-[100%] gap-2 min-w-full">
            {addedReleases.map((release) => {
              return (
                <div
                  key={release.id}
                  className="relative w-full h-full aspect-video group"
                >
                  <button
                    className="absolute inset-0 z-10 text-black transition-opacity bg-white opacity-0 group-hover:opacity-75"
                    onClick={() => _deleteRelease(release)}
                  >
                    Удалить
                  </button>
                  <ReleaseLink {...release} isLinkDisabled={true} />
                </div>
              );
            })}
            {addedReleases.length == 1 && <div></div>}
          </div>
        </div>
      </div>
      <ReleasesEditModal
        isOpen={releasesEditModalOpen}
        setIsOpen={setReleasesEditModalOpen}
        releases={addedReleases}
        releasesIds={addedReleasesIds}
        setReleases={setAddedReleases}
        setReleasesIds={setAddedReleasesIds}
      />
    </main>
  );
};

export const ReleasesEditModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  releases: any;
  setReleases: any;
  releasesIds: any;
  setReleasesIds: any;
}) => {
  const [query, setQuery] = useState("");

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.releases.length) return null;

    const url = new URL("/api/search", window.location.origin);
    url.searchParams.set("page", pageIndex.toString());
    if (!query) return null
    url.searchParams.set("q", query);
    return url.toString();
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    { initialSize: 2, revalidateFirstPage: false }
  );

  const [content, setContent] = useState([]);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].releases);
      }
      setContent(allReleases);
    }
  }, [data]);

  const [currentRef, setCurrentRef] = useState<any>(null);
  const modalRef = useCallback((ref) => {
    setCurrentRef(ref);
  }, []);

  const [scrollPosition, setScrollPosition] = useState(0);
  function handleScroll() {
    const height = currentRef.scrollHeight - currentRef.clientHeight;
    const windowScroll = currentRef.scrollTop;
    const scrolled = (windowScroll / height) * 100;
    setScrollPosition(Math.floor(scrolled));
  }
  useEffect(() => {
    if (scrollPosition >= 95 && scrollPosition <= 96) {
      setSize(size + 1);
    }
  }, [scrollPosition]);

  function _addRelease(release: any) {
    if (props.releasesIds.length == 100) {
      alert("Достигнуто максимальное количество релизов в коллекции - 100");
      return;
    }

    if (props.releasesIds.includes(release.id)) {
      alert("Релиз уже добавлен в коллекцию");
      return;
    }

    props.setReleases([...props.releases, release]);
    props.setReleasesIds([...props.releasesIds, release.id]);
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"7xl"}
    >
      <Modal.Header>Изменить релизы в коллекции</Modal.Header>
      <div
        onScroll={handleScroll}
        ref={modalRef}
        className="px-4 py-4 overflow-auto"
      >
        <form
          className="max-w-full mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            props.setReleases([]);
            setQuery(e.target[0].value.trim());
          }}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Поиск
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Поиск аниме..."
              required
              defaultValue={query || ""}
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Поиск
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-1 mt-2">
          {content.map((release) => {
            return (
              <button
                key={release.id}
                className=""
                onClick={() => _addRelease(release)}
              >
                <ReleaseLink type="poster" {...release} isLinkDisabled={true} />
              </button>
            );
          })}
          {content.length == 1 && <div></div>}
        </div>
      </div>
    </Modal>
  );
};

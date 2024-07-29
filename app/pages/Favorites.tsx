"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { Dropdown } from "flowbite-react";
import { sort } from "./common";
import { ENDPOINTS } from "#/api/config";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(`An error occurred while fetching the data. status: ${res.status}`);
    error.message = await res.json();
    throw error;
  }

  return res.json();
};

export function FavoritesPage() {
  const token = useUserStore((state) => state.token);
  const [selectedSort, setSelectedSort] = useState(0);
  const [isLoadingEnd, setIsLoadingEnd] = useState(false);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    if (token) {
      return `${ENDPOINTS.user.favorite}/all/${pageIndex}?token=${token}&sort=${sort.values[selectedSort].id}`;
    }
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    { initialSize: 2 }
  );

  const [content, setContent] = useState(null);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].content);
      }
      setContent(allReleases);
      setIsLoadingEnd(true);
    }
  }, [data]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition >= 98 && scrollPosition <= 99) {
      setSize(size + 1);
    }
  }, [scrollPosition]);

  const DropdownTheme = {
    floating: {
      target:
        "w-fit bg-blue-600 enabled:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    },
  };

  return (
    <main className="container pt-2 pb-16 mx-auto sm:pt-4 sm:pb-0">
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          Избранное
        </h1>
        <Dropdown
          label={sort.values[selectedSort].name}
          dismissOnClick={true}
          arrowIcon={false}
          theme={DropdownTheme}
        >
          {sort.values.map((item, index) => (
            <Dropdown.Item key={index} onClick={() => setSelectedSort(index)}>
              <span
                className={`w-6 h-6 iconify ${
                  sort.values[index].value.split("_")[1] == "descending"
                    ? sort.descendingIcon
                    : sort.ascendingIcon
                }`}
              ></span>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      {content && content.length > 0 ? (
        <ReleaseSection content={content} />
      ) : !isLoadingEnd || isLoading ? (
        <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>В избранном пока ничего нет...</p>
        </div>
      )}
      {data &&
        data[data.length - 1].current_page <
          data[data.length - 1].total_page_count && (
          <button
            className="mx-auto w-[calc(100%-10rem)] border border-black rounded-lg p-2 mb-6 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition"
            onClick={() => setSize(size + 1)}
          >
            <span className="w-10 h-10 iconify mdi--plus"></span>
            <span className="text-lg">Загрузить ещё</span>
          </button>
        )}
    </main>
  );
}

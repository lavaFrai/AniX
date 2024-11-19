"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { RelatedSection } from "#/components/RelatedSection/RelatedSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "../store/auth";
import { Button } from "flowbite-react";

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

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || null);
  const [searchVal, setSearchVal] = useState(
    decodeURI(searchParams.get("q")) || ""
  );
  const [where, setWhere] = useState(searchParams.get("where") || "releases");
  const [searchBy, setSearchBy] = useState(
    searchParams.get("searchBy") || null
  );
  const [list, setList] = useState(searchParams.get("list") || null);

  const token = useUserStore((state) => state.token);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (where == "list") {
      if (previousPageData && !previousPageData.content.length) return null;
    } else {
      if (previousPageData && !previousPageData.releases.length) return null;
    }

    const url = new URL("/api/search", window.location.origin);
    url.searchParams.set("page", pageIndex.toString());

    if (token) {
      url.searchParams.set("token", token);
    }

    if (where) {
      url.searchParams.set("where", where);
    }

    if (searchBy) {
      url.searchParams.set("searchBy", searchBy);
    }

    if (list) {
      url.searchParams.set("list", list);
    }

    if (query) {
      url.searchParams.set("q", query);
      return url.toString();
    }
    return;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    { initialSize: 2, revalidateFirstPage: false }
  );

  const [content, setContent] = useState(null);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      if (where == "list") {
        for (let i = 0; i < data.length; i++) {
          allReleases.push(...data[i].content);
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          allReleases.push(...data[i].releases);
        }
      }
      setContent(allReleases);
    }
  }, [data]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition >= 98 && scrollPosition <= 99) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  function _executeSearch(value: string) {
    const Params = new URLSearchParams(window.location.search);
    Params.set("q", value);
    const url = new URL(`/search?${Params.toString()}`, window.location.origin);
    setContent(null);
    setQuery(value);
    router.push(url.toString());
  }

  useEffect(() => {
    if (searchVal && searchVal.length % 4 == 1) {
      _executeSearch(searchVal.trim());
    }
  }, [searchVal]);

  if (error) return <div>failed to load: {error.message}</div>;

  return (
    <>
      <div>
        <form
          className="max-w-full mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            _executeSearch(searchVal.trim());
          }}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
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
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="mt-2">
        {data && data[0].related && <RelatedSection {...data[0].related} />}
        {content ? (
          content.length > 0 ? (
            <ReleaseSection sectionTitle="Найденные релизы" content={content} />
          ) : (
            <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
              <span className="w-24 h-24 iconify-color twemoji--crying-cat"></span>
              <p>Странно, аниме не найдено, попробуйте другой запрос...</p>
            </div>
          )
        ) : (
          isLoading && (
            <div className="flex items-center justify-center min-w-full min-h-screen">
              <Spinner />
            </div>
          )
        )}
        {!content && !isLoading && !query && (
          <div className="flex flex-col items-center justify-center min-w-full gap-2 mt-12 text-xl">
            <span className="w-16 h-16 iconify mdi--arrow-up animate-bounce"></span>
            <p>Введите ваш запрос что-бы найти любимый тайтл</p>
          </div>
        )}
      </div>
      {(data && data.length > 1) && (where == "releases"
        ? data[data.length - 1].releases.length == 25
        : data[data.length - 1].content.length == 25) ? (
            <Button
              className="w-full"
              color={"light"}
              onClick={() => setSize(size + 1)}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 iconify mdi--plus-circle "></span>
                <span className="text-lg">Загрузить ещё</span>
              </div>
            </Button>
          ) : ""}
    </>
  );
}

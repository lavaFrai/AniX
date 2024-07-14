"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "@/app/components/ReleaseSection/ReleaseSection";
import { RelatedSection } from "@/app/components/RelatedSection/RelatedSection";
import { Spinner } from "@/app/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "@/app/hooks/useScrollPosition";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || null);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.releases.length) return null;

    const url = new URL("/api/search", window.location.origin);
    url.searchParams.set("page", pageIndex);

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
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].releases);
      }
      setContent(allReleases);
    }
  }, [data]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition >= 98 && scrollPosition <= 99) {
      setSize(size + 1);
    }
  }, [scrollPosition]);

  if (error) return <div>failed to load</div>;

  return (
    <main className="container px-2 pt-2 pb-16 mx-auto sm:pt-4 sm:pb-0">
      <div>
        <form
          className="max-w-full mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(e.target[0].value.trim());
            router.push(`/search?q=${e.target[0].value.trim()}`);
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
              defaultValue={query || ""}
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
      {data && data[data.length - 1].releases.length == 25 && (
        <button
          className="mx-auto w-[calc(100%-10rem)] border border-black rounded-lg p-2 mb-6 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition"
          onClick={() => setSize(size + 1)}
        >
          <span className="w-10 h-10 iconify mdi--plus"> </span>
          <span className="text-lg">Загрузить ещё</span>
        </button>
      )}
    </main>
  );
}

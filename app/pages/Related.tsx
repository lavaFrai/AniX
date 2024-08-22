"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
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

export function RelatedPage(props: {id: number|string, title: string}) {
  const token = useUserStore((state) => state.token);
  const [isLoadingEnd, setIsLoadingEnd] = useState(false);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    if (token) {
      return `${ENDPOINTS.release.related}/${props.id}/${pageIndex}?token=${token}`;
    }
    return `${ENDPOINTS.release.related}/${props.id}/${pageIndex}`;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    { initialSize: 1 }
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

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black dark:border-white">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          Франшиза {props.title}
        </h1>
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
          <p>В франшизе пока ничего нет...</p>
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
    </>
  );
}

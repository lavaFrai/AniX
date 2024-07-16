"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "@/app/components/ReleaseSection/ReleaseSection";
import { Spinner } from "@/app/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "@/app/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";

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

export function IndexCategoryPage(props) {
  const userStore = useUserStore((state) => state);
  const token = userStore.token;
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.content.length) return null;
    if (token) {
      return `/api/home?status=${props.slug}&page=${pageIndex}&token=${token}`;
    }
    return `/api/home?status=${props.slug}&page=${pageIndex}`;
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
        allReleases.push(...data[i].content);
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
  if (isLoading)
    return (
      <main className="flex flex-col items-center justify-center min-w-full min-h-screen">
        <Spinner />
      </main>
    );

  return (
    <main className="container pt-2 pb-16 mx-auto sm:pt-4 sm:pb-0">
      {content && content.length > 0 ? (
        <ReleaseSection
          sectionTitle={props.SectionTitleMapping[props.slug]}
          content={content}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>
            В списке {props.SectionTitleMapping[props.slug]} пока ничего нет...
          </p>
        </div>
      )}
      {data && data[data.length - 1].content.length == 25 && (
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

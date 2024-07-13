"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "../../components/ReleaseSection/ReleaseSection";
import { Spinner } from "../../components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "@/app/hooks/useScrollPosition";

const fetcher = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const SectionTitleMapping = {
  last: "Последние релизы",
  finished: "Завершенные релизы",
  ongoing: "В эфире",
  announce: "Анонсированные релизы",
};

export default function HomeStatus({ params }) {
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.content.length) return null;
    return `/api/home?status=${params.slug}&page=${pageIndex}`;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    {"initialSize": 2, "revalidateFirstPage": false}
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
        setSize(size + 1)
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
    <main className="flex flex-col pt-2 pb-16 sm:pt-4 sm:pb-0">
      {content && (
        <ReleaseSection
          sectionTitle={SectionTitleMapping[params.slug]}
          content={content}
        />
      )}
      <button className="mx-auto w-[calc(100%-10rem)] border border-black rounded-lg p-4 mb-6 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition" onClick={() => setSize(size + 1)}> <span className="w-10 h-10 iconify mdi--plus"> </span> <span className="text-lg">Load More</span></button>
    </main>
  );
}

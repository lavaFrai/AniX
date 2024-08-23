"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { ENDPOINTS } from "#/api/config";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

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

export function HistoryPage() {
  const token = useUserStore((state) => state.token);
  const authState = useUserStore((state) => state.state);
  const [isLoadingEnd, setIsLoadingEnd] = useState(false);
  const router = useRouter();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    if (token) {
      return `${ENDPOINTS.user.history}/${pageIndex}?token=${token}`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  useEffect(() => {
    if (authState === "finished" && !token) {
      router.push("/login?redirect=/history");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState, token]);

  return (
    <>
      {content && content.length > 0 ? (
        <>
          <ReleaseSection sectionTitle="История" content={content} />
          {data && data[0].total_count != content.length && (
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
          )}
        </>
      ) : !isLoadingEnd || isLoading ? (
        <div className="flex flex-col items-center justify-center min-w-full min-h-[100dvh]">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>В истории пока ничего нет...</p>
        </div>
      )}
    </>
  );
}

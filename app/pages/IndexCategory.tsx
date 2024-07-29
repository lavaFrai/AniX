"use client";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { _FetchHomePageReleases } from "#/api/utils";

export function IndexCategoryPage(props) {
  const token = useUserStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function _loadInitialReleases() {
      setIsLoading(true);
      setContent(null);

      const data: any = await _FetchHomePageReleases(props.slug, token, page);

      setContent(data.content);
      setIsLoading(false);
    }

    _loadInitialReleases();
  }, [token]);

  useEffect(() => {
    async function _loadNextReleasesPage() {
      const data: any = await _FetchHomePageReleases(props.slug, token, page);
      const newContent = [...content, ...data.content];
      setContent(newContent);
    }
    if (content) {
      _loadNextReleasesPage();
    }
  }, [page]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition == 98) {
      setPage(page + 1);
    }
  }, [scrollPosition]);

  // if (error) return <div>failed to load</div>;

  return (
    <main className="container pt-2 pb-16 mx-auto sm:pt-4 sm:pb-0">
      {content && content.length > 0 ? (
        <ReleaseSection
          sectionTitle={props.SectionTitleMapping[props.slug]}
          content={content}
        />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>
            В списке {props.SectionTitleMapping[props.slug]} пока ничего нет...
          </p>
        </div>
      )}
      <button
        className="mx-auto w-[calc(100%-10rem)] border border-black rounded-lg p-2 mb-6 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition"
        onClick={() => setPage(page + 1)}
      >
        <span className="w-10 h-10 iconify mdi--plus"> </span>
        <span className="text-lg">Загрузить ещё</span>
      </button>
    </main>
  );
}

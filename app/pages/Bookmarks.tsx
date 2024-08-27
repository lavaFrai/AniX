"use client";
import useSWR from "swr";
import { ReleaseCourusel } from "#/components/ReleaseCourusel/ReleaseCourusel";
import { Spinner } from "#/components/Spinner/Spinner";
const fetcher = (...args: any) =>
  fetch([...args] as any).then((res) => res.json());
import { useUserStore } from "#/store/auth";
import { BookmarksList } from "#/api/utils";
import { ENDPOINTS } from "#/api/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function BookmarksPage(props: { profile_id?: number }) {
  const token = useUserStore((state) => state.token);
  const authState = useUserStore((state) => state.state);
  const router = useRouter();

  function useFetchReleases(listName: string) {
    let url: string;

    if (props.profile_id) {
      url = `${ENDPOINTS.user.bookmark}/all/${props.profile_id}/${BookmarksList[listName]}/0?sort=1`;
      if (token) {
        url += `&token=${token}`;
      }
    } else {
      if (token) {
        url = `${ENDPOINTS.user.bookmark}/all/${BookmarksList[listName]}/0?sort=1&token=${token}`;
      }
    }

    const { data } = useSWR(url, fetcher);
    return [data];
  }

  const [watchingData] = useFetchReleases("watching");
  const [plannedData] = useFetchReleases("planned");
  const [watchedData] = useFetchReleases("watched");
  const [delayedData] = useFetchReleases("delayed");
  const [abandonedData] = useFetchReleases("abandoned");

  useEffect(() => {
    if (authState === "finished" && !token && !props.profile_id) {
      router.push("/login?redirect=/bookmarks");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState, token]);

  return (
    <>
      {authState === "loading" &&
        (!watchingData ||
          !plannedData ||
          !watchedData ||
          !delayedData ||
          !abandonedData) && (
          <div className="flex items-center justify-center min-w-full min-h-screen">
            <Spinner />
          </div>
        )}
      {watchingData &&
        watchingData.content &&
        watchingData.content.length > 0 && (
          <ReleaseCourusel
            sectionTitle="Смотрю"
            showAllLink={
              !props.profile_id
                ? "/bookmarks/watching"
                : `/profile/${props.profile_id}/bookmarks/watching`
            }
            content={watchingData.content}
          />
        )}
      {plannedData && plannedData.content && plannedData.content.length > 0 && (
        <ReleaseCourusel
          sectionTitle="В планах"
          showAllLink={
            !props.profile_id
              ? "/bookmarks/planned"
              : `/profile/${props.profile_id}/bookmarks/planned`
          }
          content={plannedData.content}
        />
      )}
      {watchedData && watchedData.content && watchedData.content.length > 0 && (
        <ReleaseCourusel
          sectionTitle="Просмотрено"
          showAllLink={
            !props.profile_id
              ? "/bookmarks/watched"
              : `/profile/${props.profile_id}/bookmarks/watched`
          }
          content={watchedData.content}
        />
      )}
      {delayedData && delayedData.content && delayedData.content.length > 0 && (
        <ReleaseCourusel
          sectionTitle="Отложено"
          showAllLink={
            !props.profile_id
              ? "/bookmarks/delayed"
              : `/profile/${props.profile_id}/bookmarks/delayed`
          }
          content={delayedData.content}
        />
      )}
      {abandonedData &&
        abandonedData.content &&
        abandonedData.content.length > 0 && (
          <ReleaseCourusel
            sectionTitle="Заброшено"
            showAllLink={
              !props.profile_id
                ? "/bookmarks/abandoned"
                : `/profile/${props.profile_id}/bookmarks/abandoned`
            }
            content={abandonedData.content}
          />
        )}
    </>
  );
}

"use client";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { Button, Card } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useRouter } from "next/navigation";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";

import { CollectionInfoBasics } from "#/components/CollectionInfo/CollectionInfo.Basics";
import { CollectionInfoLists } from "#/components/CollectionInfo/CollectionInfoLists";

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

export const ViewCollectionPage = (props: { id: number }) => {
  const userStore = useUserStore();
  const [isLoadingEnd, setIsLoadingEnd] = useState(false);
  const router = useRouter();

  function useFetchCollectionInfo() {
    let url: string = `${ENDPOINTS.collection.base}/${props.id}`;

    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }

    const { data, isLoading } = useSWR(url, fetcher);
    return [data, isLoading];
  }
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    let url: string = `${ENDPOINTS.collection.base}/${props.id}/releases/${pageIndex}`;
    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }
    return url;
  };

  const [collectionInfo, collectionInfoIsLoading] = useFetchCollectionInfo();

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

  return (
    <main className="container pt-2 pb-16 mx-auto sm:pt-4 sm:pb-0">
      {collectionInfoIsLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-col flex-wrap gap-4 px-2 sm:flex-row">
            <CollectionInfoBasics
              image={collectionInfo.collection.image}
              title={collectionInfo.collection.title}
              description={collectionInfo.collection.description}
              authorAvatar={collectionInfo.collection.creator.avatar}
              authorLogin={collectionInfo.collection.creator.login}
              authorId={collectionInfo.collection.creator.id}
              creationDate={collectionInfo.collection.creation_date}
              updateDate={collectionInfo.collection.last_update_date}
            />
            {userStore.token && !isLoading && (
              <CollectionInfoLists
                completed={collectionInfo.completed_count}
                planned={collectionInfo.plan_count}
                abandoned={collectionInfo.dropped_count}
                delayed={collectionInfo.hold_on_count}
                watching={collectionInfo.watching_count}
                total={data[0].total_count}
              />
            )}
          </div>
          {isLoading || !content || !isLoadingEnd ? (
            <Spinner />
          ) : (
            <ReleaseSection content={content} />
          )}
        </>
      )}
    </main>
  );
};

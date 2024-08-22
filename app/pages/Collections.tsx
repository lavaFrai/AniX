"use client";
import useSWR from "swr";
import { CollectionCourusel } from "#/components/CollectionCourusel/CollectionCourusel";
import { Spinner } from "#/components/Spinner/Spinner";
const fetcher = (...args: any) =>
  fetch([...args] as any).then((res) => res.json());
import { useUserStore } from "#/store/auth";
import { ENDPOINTS } from "#/api/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CollectionsPage() {
  const userStore = useUserStore();
  const router = useRouter();

  function useFetchReleases(section: string) {
    let url: string;

    if (userStore.token && userStore.user) {
      if (section == "userCollections") {
        url = `${ENDPOINTS.collection.userCollections}/${userStore.user.id}/0?token=${userStore.token}`;
      } else if (section == "userFavoriteCollections") {
        url = `${ENDPOINTS.collection.favoriteCollections}/all/0?token=${userStore.token}`;
      }
    }

    const { data } = useSWR(url, fetcher);
    return [data];
  }

  const [userCollections] = useFetchReleases("userCollections");
  const [favoriteCollections] = useFetchReleases("userFavoriteCollections");

  useEffect(() => {
    if (userStore.state === "finished" && !userStore.token) {
      router.push("/login?redirect=/collections");
    }
  }, [userStore.state, userStore.token]);

  return (
    <>
      {userStore.state === "loading" &&
        (!userCollections || !favoriteCollections) && (
          <div className="flex items-center justify-center min-w-full min-h-screen">
            <Spinner />
          </div>
        )}

      {userCollections && userCollections.content && (
        <CollectionCourusel
          sectionTitle="Мои коллекции"
          showAllLink={`/profile/${userStore.user.id}/collections`}
          content={userCollections.content}
          isMyCollections={true}
        />
      )}
      {favoriteCollections &&
        favoriteCollections.content &&
        favoriteCollections.content.length > 0 && (
          <CollectionCourusel
            sectionTitle="Избранные коллекции"
            showAllLink="/collections/favorites"
            content={favoriteCollections.content}
          />
        )}
    </>
  );
}

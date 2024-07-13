"use client";
import useSWR from "swr";
import { ReleaseCourusel } from "./components/ReleaseCourusel/ReleaseCourusel";
import { Spinner } from "./components/Spinner/Spinner";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  function useFetchReleases(status) {
    const { data } = useSWR(`/api/home?status=${status}`, fetcher);
    return [data];
  }

  const [lastReleasesData] = useFetchReleases("last");
  const [finishedReleasesData] = useFetchReleases("finished");
  const [ongoingReleasesData] = useFetchReleases("ongoing");
  const [announceReleasesData] = useFetchReleases("announce");

  return (
    <main className="flex flex-col pt-2 pb-16 sm:pt-4 sm:pb-0">
      {lastReleasesData ? (
        <ReleaseCourusel
          sectionTitle="Последние релизы"
          showAllLink="/home/last"
          content={lastReleasesData.content}
        />
      ) : (
        <div className="flex items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      )}
      {finishedReleasesData && (
        <ReleaseCourusel
          sectionTitle="Завершенные релизы"
          showAllLink="/home/finished"
          content={finishedReleasesData.content}
        />
      )}
      {ongoingReleasesData && (
        <ReleaseCourusel
          sectionTitle="В эфире"
          showAllLink="/home/ongoing"
          content={ongoingReleasesData.content}
        />
      )}
      {announceReleasesData && (
        <ReleaseCourusel
          sectionTitle="Анонсированные релизы"
          showAllLink="/home/announce"
          content={announceReleasesData.content}
        />
      )}
    </main>
  );
}

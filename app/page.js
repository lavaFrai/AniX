"use client";
import useSWR from "swr";
import { ReleaseCourusel } from "./components/ReleaseCourusel/ReleaseCourusel";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function fetchReleases(status) {
  const { data, error, isLoading } = useSWR(
    `/api/home?status=${status}`,
    fetcher
  );
  return [data, error, isLoading];
}

export default function Home() {
  const [lastReleasesData, lastReleasesError, lastReleasesIsLoading] =
    fetchReleases("last");
  const [
    finishedReleasesData,
    finishedReleasesError,
    finishedReleasesIsLoading,
  ] = fetchReleases("finished");
  const [ongoingReleasesData, ongoingReleasesError, ongoingReleasesIsLoading] =
    fetchReleases("ongoing");
  const [
    announceReleasesData,
    announceReleasesError,
    announceReleasesIsLoading,
  ] = fetchReleases("announce");

  return (
    <main className="flex flex-col sm:pt-4 sm:pb-0 pb-16">
      {lastReleasesData && (
        <ReleaseCourusel id="home-courusel-last" sectionTitle="Последние релизы" showAllLink="/last" content={lastReleasesData.content} />
      )}
      {finishedReleasesData && (
        <ReleaseCourusel id="home-courusel-finished" sectionTitle="Завершенные релизы" showAllLink="/finished" content={finishedReleasesData.content} />
      )}
      {ongoingReleasesData && (
        <ReleaseCourusel id="home-courusel-ongoing" sectionTitle="В эфире" showAllLink="/ongoing" content={ongoingReleasesData.content} />
      )}
      {announceReleasesData && (
        <ReleaseCourusel id="home-courusel-announce" sectionTitle="Анонсированные релизы" showAllLink="/announce" content={announceReleasesData.content} />
      )}
    </main>
  );
}

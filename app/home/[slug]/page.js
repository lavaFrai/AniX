"use client";
import useSWR from "swr";
import { ReleaseSection } from "../../components/ReleaseSection/ReleaseSection";
import { Spinner } from "../../components/Spinner/Spinner";

const fetcher = async (...args) => {
  const res = await fetch(...args);

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
  const { data, error, isLoading } = useSWR(
    `/api/home?status=${params.slug}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <main className="flex flex-col items-center justify-center min-w-full min-h-screen">
        <Spinner />
      </main>
    );

  return (
    <main className="flex flex-col pt-2 pb-16 sm:pt-4 sm:pb-0">
      {data && (
        <ReleaseSection
          sectionTitle={SectionTitleMapping[params.slug]}
          content={data.content}
        />
      )}
    </main>
  );
}

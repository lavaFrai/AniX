import { CollectionsFullPage } from "#/pages/CollectionsFull";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const release = await fetchDataViaGet(`https://api.anixart.tv/release/${id}`);
  const previousOG = (await parent).openGraph;

  return {
    title: release.release.title_ru + " - в коллекциях",
    description: release.release.description,
    openGraph: {
      ...previousOG,
      images: [
        {
          url: release.release.image, // Must be an absolute URL
          width: 600,
          height: 800,
        },
      ],
    },
  };
}

export default async function Collections({ params }) {
  const release: any = await fetchDataViaGet(
    `https://api.anixart.tv/release/${params.id}`
  );
  return (
    <CollectionsFullPage
      type="release"
      title={release.release.title_ru + " в коллекциях"}
      release_id={params.id}
    />
  );
}

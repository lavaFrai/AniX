import { ReleasePage } from "#/pages/Release";
import { fetchDataViaGet } from "#/api/utils";

export async function generateMetadata({ params }) {
  const id = params.id
  const release = await fetchDataViaGet(`https://api.anixart.tv/release/${id}`);

  return {
    title: release.release.title_ru,
  };
}

export default async function Search({ params }) {
  const id = params.id
  return <ReleasePage id={id} />;
}

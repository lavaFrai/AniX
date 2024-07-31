import { RelatedPage } from "#/pages/Related";
import { fetchDataViaGet } from "#/api/utils";

export async function generateMetadata({ params }) {
  const id:string = params.id;
  const related: any = await fetchDataViaGet(`https://api.anixart.tv/related/${id}/0`);
  const firstRelease: any = await fetchDataViaGet(`https://api.anixart.tv/release/${related.content[0].id}`);

  return {
    title: "Франшиза " + firstRelease.release.related.name_ru || firstRelease.release.related.name,
  };
}

export default async function Related({ params }) {
  const id: string = params.id;
  const related: any = await fetchDataViaGet(`https://api.anixart.tv/related/${id}/0`);
  const firstRelease: any = await fetchDataViaGet(`https://api.anixart.tv/release/${related.content[0].id}`);
  return <RelatedPage id={id} title={firstRelease.release.related.name_ru || firstRelease.release.related.name} />;
}

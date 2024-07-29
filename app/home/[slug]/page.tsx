import { IndexCategoryPage } from "#/pages/IndexCategory";

const SectionTitleMapping = {
  last: "Последние релизы",
  finished: "Завершенные релизы",
  ongoing: "В эфире",
  announce: "Анонсированные релизы",
};

export async function generateMetadata({ params }) {
  return {
    title: SectionTitleMapping[params.slug],
  };
}

export default function Index({ params }) {
  const metadata = {
    title: "AniX | " + SectionTitleMapping[params.slug],
  };
  return (
    <IndexCategoryPage
      slug={params.slug}
      SectionTitleMapping={SectionTitleMapping}
    />
  );
}

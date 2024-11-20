import { IndexCategoryPage } from "#/pages/IndexCategory";

const SectionTitleMapping = {
  last: "Последние релизы",
  finished: "Завершенные релизы",
  ongoing: "В эфире",
  announce: "Анонсированные релизы",
  films: "Фильмы",
};

export async function generateMetadata({ params }) {
  return {
    title: SectionTitleMapping[params.slug],
  };
}

export default function Index({ params }) {
  return (
    <IndexCategoryPage
      slug={params.slug}
      SectionTitleMapping={SectionTitleMapping}
    />
  );
}

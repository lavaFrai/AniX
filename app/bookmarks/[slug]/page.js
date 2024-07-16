import { BookmarksCategoryPage } from "@/app/pages/BookmarksCategory";

const SectionTitleMapping = {
  watching: "Смотрю",
  planned: "В планах",
  watched: "Просмотрено",
  delayed: "Отложено",
  abandoned: "Заброшено",
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
    <BookmarksCategoryPage
      slug={params.slug}
      SectionTitleMapping={SectionTitleMapping}
    />
  );
}

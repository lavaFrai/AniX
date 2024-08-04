import dynamic from "next/dynamic";
import { SearchPage } from "#/pages/Search";
import { Metadata } from "next";

export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const query = searchParams.q;

  return {
    title: query || "Поиск",
  };
}

const SearchDynamic = dynamic(() => Promise.resolve(SearchPage), {
  ssr: false,
});
export default function Search() {
  return <SearchDynamic />;
}

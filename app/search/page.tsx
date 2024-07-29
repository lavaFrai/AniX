import dynamic from "next/dynamic";
import { SearchPage } from "#/pages/Search";

export async function generateMetadata({ searchParams }) {
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

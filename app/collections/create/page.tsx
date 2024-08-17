import { CreateCollectionPage } from "#/pages/CreateCollection";
import dynamic from "next/dynamic";

export const metadata = {
  title: "Создание коллекции",
  description: "Создание новой коллекции",
};

const CreateCollectionDynamic = dynamic(
  () => Promise.resolve(CreateCollectionPage),
  {
    ssr: false,
  }
);

export default function Collections() {
  return <CreateCollectionDynamic />;
}

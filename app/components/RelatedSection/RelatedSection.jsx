import { numberDeclension } from "@/app/api/utils";
import Link from "next/link";

export const RelatedSection = (props) => {
  const declension = numberDeclension(
    props.release_count,
    "релиз",
    "релиза",
    "релизов"
  );
  return (
    <section>
      <div className="flex flex-col justify-between gap-4 p-4 xl:flex-row">
        <div className="flex items-center justify-center p-4">
          {props.images.map((item) => {
            return (
              <img
                key={item}
                src={item}
                alt=""
                className="w-[100px] lg:w-[300px] object-cover aspect-[9/12] even:scale-110 shadow-md even:shadow-lg even:z-30 origin-center first:[transform:translateX(25%)] last:[transform:translateX(-25%)]"
              />
            );
          })}
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-2">
          <h1 className="text-2xl font-bold">{props.name_ru}</h1>
          <p>
            {props.release_count} {declension} во франшизе
          </p>
          <Link href={`/related/${props.id}`}>
          <div className="flex items-center px-8 py-2 transition border border-black rounded-full hover:text-white hover:bg-black">
            <p className="text-xl font-bold">Перейти</p>
            <span className="w-6 h-6 iconify mdi--arrow-right"></span>
          </div>
        </Link>
        </div>
      </div>
    </section>
  );
};

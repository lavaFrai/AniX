import { Card } from "flowbite-react";
export const ReleaseInfoBasics = (props: {
  image: string;
  title: { ru: string; original: string };
  note: string | null;
  description: string;
}) => {
  return (
    <Card className="h-full">
      <div className="flex flex-col w-full h-full gap-4 lg:flex-row">
        <img
          className="w-[285px] max-h-[385px] object-cover border border-gray-200 rounded-lg shadow-md dark:border-gray-700"
          src={props.image}
          alt=""
        ></img>
        <div className="flex flex-col max-w-2xl gap-2 text-sm md:text-base">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-black md:text-2xl dark:text-white">
              {props.title.ru}
            </p>
            <p className="text-sm text-gray-500 md:text-base dark:text-gray-400">
              {props.title.original}
            </p>
          </div>
          {props.note && (
            <div className="py-2 bg-blue-100 border-l-4 border-blue-700 rounded-md ">
              <div id="note" className="ml-2"></div>
            </div>
          )}
          <p>{props.description}</p>
        </div>
      </div>
    </Card>
  );
};

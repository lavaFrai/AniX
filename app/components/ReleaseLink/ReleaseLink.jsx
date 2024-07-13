import Link from "next/link";

export const ReleaseLink = (props) => {
  const grade = props.grade.toFixed(1);
  return (
    <Link href={`/release/${props.id}`}>
      <div className="w-full aspect-video group">
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-t from-black to-transparent">
          <img
            className="absolute z-0 object-cover w-full h-full transition mix-blend-overlay group-hover:scale-110"
            src={props.image}
            alt=""
          />
          <div
            className={`absolute left-2 top-2 rounded-sm ${
              grade == 0
                ? "hidden"
                : grade < 2
                ? "bg-red-500"
                : grade < 3
                ? "bg-orange-500"
                : grade < 4
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white">
              {grade}
            </p>
          </div>
          <div className="absolute flex flex-col items-end gap-1 top-2 right-2">
            {props.status ? (
              <div className="bg-gray-500 rounded-sm">
                <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white">
                  {props.status.name}
                </p>
              </div>
            ) : (
              <div className="bg-gray-500 rounded-sm">
                <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white">
                  {props.status_id == 1
                    ? "Завершено"
                    : props.status_id == 2
                    ? "Онгоинг"
                    : "Анонс"}
                </p>
              </div>
            )}
            <div className="bg-gray-500 rounded-sm">
              <div className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white flex">
                {props.episodes_released && (
                  <p>{`${props.episodes_released}/`}</p>
                )}
                {props.episodes_total ? (
                  <p>{props.episodes_total} эп.</p>
                ) : (
                  <p>? эп.</p>
                )}
              </div>
            </div>
          </div>
          <p className="absolute text-xs text-white xl:text-base lg:text-lg left-2 bottom-2 right-2">
            {props.title_ru}
          </p>
        </div>
      </div>
    </Link>
  );
};

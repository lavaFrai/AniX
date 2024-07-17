import Link from "next/link";
import { sinceUnixDate } from "@/app/api/utils";

export const ReleaseLink = (props) => {
  const grade = props.grade.toFixed(1);
  const profile_lists = {
    // 0: "Не смотрю",
    1: { name: "Смотрю", bg_color: "bg-green-500" },
    2: { name: "В планах", bg_color: "bg-purple-500" },
    3: { name: "Просмотрено", bg_color: "bg-blue-500" },
    4: { name: "Отложено", bg_color: "bg-yellow-500" },
    5: { name: "Брошено", bg_color: "bg-red-500" },
  };

  const profile_list_status = props.profile_list_status;
  let user_list = null;
  if (profile_list_status != null || profile_list_status != 0) {
    user_list = profile_lists[profile_list_status];
  }
  return (
    <Link href={`/release/${props.id}`}>
      <div className="w-full aspect-video group">
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-t from-black to-transparent">
          <img
            className="absolute z-0 object-cover w-full h-full transition mix-blend-overlay group-hover:scale-110"
            src={props.image}
            alt=""
          />
          <div className="absolute flex flex-wrap items-start justify-start max-w-[45%] gap-0.5 sm:gap-1 left-2 top-2">
            <div className="flex gap-1 ">
              <div
                className={`rounded-sm ${
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
                <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-base text-white">
                  {grade}
                </p>
              </div>
            </div>
            {user_list && (
              <div className={`rounded-sm ${user_list.bg_color}`}>
                <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white">
                  {user_list.name}
                </p>
              </div>
            )}
          </div>
          <div className="absolute flex flex-wrap max-w-[45%] justify-end items-end gap-0.5 sm:gap-1 top-2 right-2">
            {props.status ? (
              <div className="bg-gray-500 rounded-sm">
                <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white text-center">
                  {props.status.name}
                </p>
              </div>
            ) : (
              <div className="bg-gray-500 rounded-sm">
                <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white text-center">
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
            {props.is_favorite && (
              <div className="flex items-center justify-center bg-pink-500 rounded-sm">
                <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--heart"></span>
              </div>
            )}
            {props.last_view_episode && (
              <div className="bg-gray-500 rounded-sm">
                <div className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white flex">
                  {props.last_view_episode.name ? (
                    <p>{`${props.last_view_episode.name}`} </p>
                  ) : (
                    <p>{`${props.last_view_episode.position + 1} серия`}</p>
                  )}
                </div>
              </div>
            )}
            {"last_view_timestamp" in props &&
              props.last_view_timestamp != 0 && (
                <div className="bg-gray-500 rounded-sm">
                  <div className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white flex">
                    <p>{sinceUnixDate(props.last_view_timestamp)}</p>
                  </div>
                </div>
              )}
          </div>
          <p className="absolute text-xs text-white xl:text-base lg:text-lg left-2 bottom-2 right-2">
            {props.title_ru}
          </p>
        </div>
      </div>
    </Link>
  );
};

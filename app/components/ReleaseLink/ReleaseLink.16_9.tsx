import Link from "next/link";
import { sinceUnixDate } from "#/api/utils";
import { Chip } from "#/components/Chip/Chip";

const profile_lists = {
  // 0: "Не смотрю",
  1: { name: "Смотрю", bg_color: "bg-green-500" },
  2: { name: "В планах", bg_color: "bg-purple-500" },
  3: { name: "Просмотрено", bg_color: "bg-blue-500" },
  4: { name: "Отложено", bg_color: "bg-yellow-500" },
  5: { name: "Брошено", bg_color: "bg-red-500" },
};

export const ReleaseLink169 = (props: any) => {
  const grade = props.grade.toFixed(1);
  const profile_list_status = props.profile_list_status;
  let user_list = null;
  if (profile_list_status != null || profile_list_status != 0) {
    user_list = profile_lists[profile_list_status];
  }
  return (
    <Link
      href={`/release/${props.id}`}
      className={props.isLinkDisabled ? "pointer-events-none" : ""}
      aria-disabled={props.isLinkDisabled}
      tabIndex={props.isLinkDisabled ? -1 : undefined}
    >
      <div className="w-full aspect-video group">
        <div
          className="relative w-full h-full overflow-hidden bg-center bg-no-repeat bg-cover rounded-sm group-hover:animate-bg_zoom animate-bg_zoom_rev group-hover:[background-size:110%] "
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%), url(${props.image})`,
          }}
        >
          <div className="absolute flex flex-wrap items-start justify-start gap-0.5 sm:gap-1 left-2 top-2">
            <Chip
              bg_color={
                grade == 0
                  ? "hidden"
                  : grade < 2
                  ? "bg-red-500"
                  : grade < 3
                  ? "bg-orange-500"
                  : grade < 4
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }
              name={grade}
            />
            {user_list && (
              <Chip bg_color={user_list.bg_color} name={user_list.name} />
            )}
            {props.status ? (
              <Chip name={props.status.name} />
            ) : (
              props.status_id != 0 && (
                <Chip
                  name={
                    props.status_id == 1
                      ? "Завершено"
                      : props.status_id == 2
                      ? "Онгоинг"
                      : props.status_id == 3 && "Анонс"
                  }
                />
              )
            )}
            <Chip
              name={props.episodes_released && props.episodes_released}
              name_2={
                props.episodes_total ? props.episodes_total + " эп." : "? эп."
              }
              devider="/"
            />
            {props.last_view_episode && (
              <Chip
                name={
                  props.last_view_episode.name
                    ? props.last_view_episode.name
                    : `${props.last_view_episode.position + 1} серия`
                }
                name_2={
                  "last_view_timestamp" in props &&
                  sinceUnixDate(props.last_view_timestamp)
                }
                devider=", "
              />
            )}
            {props.category && <Chip name={props.category.name} />}
            {props.is_favorite && (
              <div className="flex items-center justify-center bg-pink-500 rounded-sm">
                <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--heart"></span>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 px-2 py-2 lg:translate-y-[100%] group-hover:lg:translate-y-0 transition-transform">
            <p className="text-sm font-bold text-white transition-transform lg:-translate-y-10 group-hover:lg:translate-y-0 xl:text-base lg:text-lg">
              {props.title_ru}
            </p>
            <p className="text-xs text-white xl:text-base lg:text-lg right-2">
              {props.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

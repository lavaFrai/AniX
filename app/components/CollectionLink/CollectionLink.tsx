import Link from "next/link";
import { sinceUnixDate } from "#/api/utils";
import { Chip } from "#/components/Chip/Chip";

export const CollectionLink = (props: any) => {
  return (
    <Link href={`/collection/${props.id}`}>
      <div className="w-full aspect-video group">
        <div
          className="relative w-full h-full overflow-hidden bg-center bg-no-repeat bg-cover rounded-sm group-hover:animate-bg_zoom animate-bg_zoom_rev group-hover:[background-size:110%] "
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%), url(${props.image})`,
          }}
        >
          <div className="absolute flex flex-wrap items-start justify-start gap-0.5 sm:gap-1 left-2 top-2">
            {props.is_favorite && (
              <div className="flex items-center justify-center bg-pink-500 rounded-sm">
                <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--heart"></span>
              </div>
            )}
            {props.is_private && (
              <div className="flex items-center justify-center bg-yellow-400 rounded-sm">
                <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--lock"></span>
              </div>
            )}
            <Chip icon_name="material-symbols--favorite" name_2={props.favorites_count} />
            <Chip icon_name="material-symbols--comment" name_2={props.comment_count} />
          </div>
          <p className="absolute text-xs text-white xl:text-base lg:text-lg left-2 bottom-2 right-2">
            {props.title}
          </p>
        </div>
      </div>
    </Link>
  );
};

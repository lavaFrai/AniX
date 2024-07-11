import Link from "next/link";

export const ReleaseLink = (props) => {
  const grade = props.grade.toFixed(1);
  return (
    <Link href={`/release/${props.id}`}>
        <div className="aspect-video xl:w-[600px] md:w-[400px] w-[200px]">
          <div className="relative w-full h-full bg-gradient-to-t from-black to-transparent">
            <img
              className="absolute object-cover w-full h-full mix-blend-overlay"
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
              <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-base text-white">{grade}</p>
            </div>
            <div className="absolute bg-gray-500 rounded-sm top-2 right-2">
              <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-base text-white">{props.status.name}</p>
            </div>
            <p className="absolute text-xs text-white md:text-base lg:text-lg left-2 bottom-2">{props.title_ru}</p>
          </div>
        </div>
    </Link>
  );
};

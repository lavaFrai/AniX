import Link from "next/link";

export const ReleaseLink = (props) => {
  const grade = props.grade.toFixed(1);
  return (
    <Link href={`/release/${props.id}`} className=" hover:scale-105 transition hover:z-10">
        <div className="aspect-video xl:w-[600px] md:w-[400px] w-[200px]">
          <div className="bg-gradient-to-t from-black to-transparent relative w-full h-full">
            <img
              className="w-full h-full object-cover absolute mix-blend-overlay"
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
            <div className="absolute top-2 right-2 bg-gray-500 rounded-sm">
              <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-base text-white">{props.status.name}</p>
            </div>
            <p className="absolute left-2 bottom-2 text-white">{props.title_ru}</p>
          </div>
        </div>
    </Link>
  );
};

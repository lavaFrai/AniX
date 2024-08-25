import { Card, Carousel, RatingStar, Rating } from "flowbite-react";
import type {
  FlowbiteCarouselIndicatorsTheme,
  FlowbiteCarouselControlTheme,
} from "flowbite-react";
import Image from "next/image";
import { unixToDate } from "#/api/utils";
import Link from "next/link";

const CarouselIndicatorsTheme: FlowbiteCarouselIndicatorsTheme = {
  active: {
    off: "bg-gray-300/50 hover:bg-gray-400 dark:bg-gray-400/50 dark:hover:bg-gray-200",
    on: "bg-gray-600 dark:bg-gray-200",
  },
  base: "h-3 w-3 rounded-full",
  wrapper: "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3",
};

const CarouselControlsTheme: FlowbiteCarouselControlTheme = {
  base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-600/30 group-hover:bg-gray-600/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-600 dark:bg-gray-400/30 dark:group-hover:bg-gray-400/60 dark:group-focus:ring-gray-400/70 sm:h-10 sm:w-10",
  icon: "h-5 w-5 text-gray-600 dark:text-gray-400 sm:h-6 sm:w-6",
};

const CarouselTheme = {
  indicators: CarouselIndicatorsTheme,
  control: CarouselControlsTheme,
};

export const ProfileReleaseRatings = (props: any) => {
  return (
    <Card className="h-fit">
      <h1 className="text-2xl font-bold">Оценки</h1>
      <div className="max-w-[700px] min-h-[200px]">
        <Carousel theme={CarouselTheme}>
          {props.ratings.map((release) => {
            return (
              <Link href={`/release/${release.id}`} key={`vote-${release.id}`}>
                <div className="flex gap-4 xl:mx-20">
                  <Image
                    src={release.image}
                    width={100}
                    height={150}
                    alt=""
                    className="border-gray-200 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800"
                  />
                  <div className="py-4 flex flex-col gap-1">
                    <h2 className="text-lg">{release.title_ru}</h2>
                    <Rating size="md">
                      <RatingStar filled={release.my_vote >= 1} />
                      <RatingStar filled={release.my_vote >= 2} />
                      <RatingStar filled={release.my_vote >= 3} />
                      <RatingStar filled={release.my_vote >= 4} />
                      <RatingStar filled={release.my_vote >= 5} />
                    </Rating>
                    <h2 className="text-md text-gray-500 dark:text-gray-400">
                      {unixToDate(release.voted_at, "full")}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </Carousel>
      </div>
    </Card>
  );
};

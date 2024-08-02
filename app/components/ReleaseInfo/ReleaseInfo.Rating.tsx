import {
  Card,
  Rating,
  Flowbite,
  Button,
  CustomFlowbiteTheme,
} from "flowbite-react";
import { numberDeclension } from "#/api/utils";

const RatingTheme: CustomFlowbiteTheme = {
  ratingAdvanced: {
    progress: {
      base: "mx-4 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700",
    },
  },
};
export const ReleaseInfoRating = (props: {
  grade: number;
  token: string | null;
  votes: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    total: number;
    user: number | null;
  };
}) => {
  return (
    <Card>
      <div className="flex flex-col gap-2 lg:items-center lg:flex-row">
        <Rating>
          <Rating.Star />
          <p className="ml-2 text-sm font-bold dark:text-white">
            {props.grade.toFixed(2)} из 5
          </p>
        </Rating>
        {props.token && (
          <>
            <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400 hidden lg:block" />
            {props.votes.user ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  ваша оценка: {props.votes.user}
                </p>
                <Button
                  size={"xs"}
                  className="text-gray-500 border border-gray-600 rounded-full hover:bg-black hover:text-white hover:border-black dark:text-gray-400 dark:border-gray-500"
                  color="inline"
                >
                  изменить
                </Button>
              </div>
            ) : (
              <Button
                size={"xs"}
                className="text-gray-500 border border-gray-600 rounded-full hover:bg-black hover:text-white hover:border-black dark:text-gray-400 dark:border-gray-500"
                color="inline"
              >
                оценить
              </Button>
            )}
          </>
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {props.votes.total}{" "}
        {numberDeclension(props.votes.total, "голос", "голоса", "голосов")}
      </p>
      <Flowbite theme={{ theme: RatingTheme }}>
        <Rating.Advanced
          percentFilled={Math.floor(
            (props.votes["5"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          5
        </Rating.Advanced>
        <Rating.Advanced
          percentFilled={Math.floor(
            (props.votes["4"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          4
        </Rating.Advanced>
        <Rating.Advanced
          percentFilled={Math.floor(
            (props.votes["3"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          3
        </Rating.Advanced>
        <Rating.Advanced
          percentFilled={Math.floor(
            (props.votes["2"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          2
        </Rating.Advanced>
        <Rating.Advanced
          percentFilled={Math.floor(
            (props.votes["1"] / props.votes.total) * 100
          )}
        >
          1
        </Rating.Advanced>
      </Flowbite>
    </Card>
  );
};

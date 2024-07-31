"use client";

import useSWR from "swr";
import { Spinner } from "#/components/Spinner/Spinner";
const fetcher = (...args: any) =>
  fetch([...args] as any).then((res) => res.json());
import { useUserStore } from "#/store/auth";
import { Card, Dropdown, Button, Carousel, Rating } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  unixToDate,
  getSeasonFromUnix,
  minutesToTime,
  numberDeclension,
} from "#/api/utils";
import { ReleaseLink } from "#/components/ReleaseLink/ReleaseLink";
import { ReleasePlayer } from "#/components/ReleasePlayer/ReleasePlayer";
import { ENDPOINTS } from "#/api/config";
import { Table } from "flowbite-react";
import { ReleaseInfoSearchLink } from "#/components/ReleaseInfo/ReleaseInfo.SearchLink";
import Link from "next/link";

const lists = [
  { list: 0, name: "Не смотрю" },
  { list: 1, name: "Смотрю" },
  { list: 2, name: "В планах" },
  { list: 3, name: "Просмотрено" },
  { list: 4, name: "Отложено" },
  { list: 5, name: "Брошено" },
];

const weekDay = [
  "_",
  "каждый понедельник",
  "каждый вторник",
  "каждую среду",
  "каждый четверг",
  "каждую пятницу",
  "каждую субботу",
  "каждое воскресенье",
];

const YearSeason = ["_", "Зима", "Весна", "Лето", "Осень"];

const DropdownTheme = {
  floating: {
    target:
      "flex-1 bg-blue-600 enabled:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
  },
};

export const ReleasePage = (props: any) => {
  const token = useUserStore((state) => state.token);
  const [userList, setUserList] = useState(0);
  const [userFavorite, setUserFavorite] = useState(false);

  function useFetch(id: number) {
    let url: string;

    url = `/api/release/${id}`;
    if (token) {
      url += `?token=${token}`;
    }
    const { data, isLoading, error } = useSWR(url, fetcher);
    return [data, isLoading, error];
  }
  const [data, isLoading, error] = useFetch(props.id);

  useEffect(() => {
    if (data) {
      const el = document.getElementById("note");
      if (el) {
        el.innerHTML = data.release.note;
      }
      setUserList(data.release.profile_list_status || 0);
      setUserFavorite(data.release.is_favorite);
    }
  }, [data]);

  function _addToFavorite() {
    if (data && token) {
      setUserFavorite(!userFavorite);
      if (userFavorite) {
        fetch(
          `${ENDPOINTS.user.favorite}/delete/${data.release.id}?token=${token}`
        );
      } else {
        fetch(
          `${ENDPOINTS.user.favorite}/add/${data.release.id}?token=${token}`
        );
      }
    }
  }

  function _addToList(list: number) {
    if (data && token) {
      setUserList(list);
      fetch(
        `${ENDPOINTS.user.bookmark}/add/${list}/${data.release.id}?token=${token}`
      );
    }
  }

  return data ? (
    <main className="container px-4 pt-4 pb-24 mx-auto sm:pb-4">
      <div className="grid grid-cols-[100%] lg:grid-cols-[70%_30%] gap-2 justify-center">
        <div className="[grid-column:1] flex flex-col gap-2">
          <Card className="lg:[grid-column:1]">
            <div className="flex flex-col w-full h-full gap-4 lg:flex-row">
              <img
                className="w-[285px] max-h-[385px] object-cover border border-gray-200 rounded-lg shadow-md dark:border-gray-700"
                src={data.release.image}
                alt=""
              ></img>
              <div className="flex flex-col max-w-2xl gap-2 text-sm md:text-base">
                <div className="flex flex-col gap-1">
                  {data.release.title_ru && (
                    <p className="text-xl font-bold text-black md:text-2xl">
                      {data.release.title_ru}
                    </p>
                  )}
                  {data.release.title_original && (
                    <p className="text-sm text-gray-500 md:text-base">
                      {data.release.title_original}
                    </p>
                  )}
                </div>
                {data.release.note && (
                  <div className="py-2 bg-blue-100 border-l-4 border-blue-700 rounded-md ">
                    <div id="note" className="ml-2"></div>
                  </div>
                )}
                {data.release.description && <p>{data.release.description}</p>}
              </div>
            </div>
          </Card>
          {data.release.status.name.toLowerCase() != "анонс" && (
            <ReleasePlayer id={props.id} />
          )}
        </div>
        <div className="[grid-column:1] lg:[grid-column:2] flex flex-col gap-2">
          <Card className="order-2 lg:order-1">
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="py-0">
                    {data.release.country ? (
                      data.release.country.toLowerCase() == "япония" ? (
                        <span className="w-8 h-8 iconify-color twemoji--flag-for-japan"></span>
                      ) : (
                        <span className="w-8 h-8 iconify-color twemoji--flag-for-china"></span>
                      )
                    ) : (
                      <span className="w-8 h-8 iconify-color twemoji--flag-for-united-nations "></span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {data.release.country && data.release.country}
                    {(data.release.aired_on_date != 0 || data.release.year) &&
                      ", "}
                    {data.release.aired_on_date != 0 &&
                      `${getSeasonFromUnix(data.release.aired_on_date)} `}
                    {data.release.year && `${data.release.year} г.`}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="py-0">
                    <span className="w-8 h-8 iconify-color mdi--animation-play-outline "></span>
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {data.release.episodes_released
                      ? data.release.episodes_released
                      : "?"}
                    {"/"}
                    {data.release.episodes_total
                      ? data.release.episodes_total + " эп. "
                      : "? эп. "}
                    {data.release.duration != 0 &&
                      `по ${minutesToTime(data.release.duration)}`}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="py-0">
                    <span className="w-8 h-8 iconify-color mdi--calendar-outline "></span>
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {data.release.category.name}
                    {", "}
                    {data.release.broadcast == 0
                      ? data.release.status.name.toLowerCase()
                      : `выходит ${weekDay[data.release.broadcast]}`}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="py-0">
                    <span className="w-8 h-8 iconify-color mdi--people-group-outline "></span>
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {data.release.studio && (
                      <>
                        {"Студия: "}
                        {data.release.studio
                          .split(", ")
                          .map((studio: string, index: number) => {
                            return (
                              <>
                                {index > 0 && ", "}
                                <ReleaseInfoSearchLink
                                  title={studio}
                                  searchBy={1}
                                />
                              </>
                            );
                          })}
                        {(data.release.author || data.release.director) && ", "}
                      </>
                    )}
                    {data.release.author && (
                      <>
                        {"Автор: "}
                        <ReleaseInfoSearchLink
                          title={data.release.author}
                          searchBy={3}
                        />
                        {data.release.director && ", "}
                      </>
                    )}
                    {data.release.director && (
                      <>
                        {"Режиссёр: "}
                        <ReleaseInfoSearchLink
                          title={data.release.director}
                          searchBy={2}
                        />
                      </>
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="py-0">
                    <span className="w-8 h-8 iconify-color mdi--tag-outline "></span>
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {data.release.genres &&
                      data.release.genres
                        .split(", ")
                        .map((genre: string, index: number) => {
                          return (
                            <>
                              {index > 0 && ", "}
                              <ReleaseInfoSearchLink
                                title={genre}
                                searchBy={4}
                              />
                            </>
                          );
                        })}
                  </Table.Cell>
                </Table.Row>
                {data.release.status.name.toLowerCase() == "анонс" && (
                  <Table.Row>
                    <Table.Cell className="py-0">
                      <span className="w-8 h-8 iconify-color mdi--clock-outline "></span>
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {data.release.aired_on_date != 0 ? (
                        unixToDate(data.release.aired_on_date)
                      ) : data.release.year ? (
                        <>
                          {data.release.season && data.release.season != 0
                            ? `${YearSeason[data.release.season]} `
                            : ""}
                          {data.release.year && `${data.release.year} г.`}
                        </>
                      ) : (
                        "Скоро"
                      )}
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Card>
          <div className="flex flex-col order-1 gap-2 lg:order-2">
            {token && (
              <Card>
                <div className="flex flex-wrap gap-2">
                  <Dropdown
                    label={lists[userList].name}
                    dismissOnClick={true}
                    theme={DropdownTheme}
                  >
                    {lists.map((list) => (
                      <Dropdown.Item
                        key={list.list}
                        onClick={() => _addToList(list.list)}
                      >
                        {list.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                  <Button
                    className="bg-blue-600 enabled:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      _addToFavorite();
                    }}
                  >
                    <span
                      className={`iconify w-6 h-6 ${
                        userFavorite ? "mdi--heart" : "mdi--heart-outline"
                      }`}
                    ></span>
                  </Button>
                </div>
              </Card>
            )}
            {data.release.status.name.toLowerCase() != "анонс" && (
              <Card>
                <div className="flex items-center gap-2">
                  <Rating>
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star filled={false} />
                    <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {data.release.grade.toFixed(2)} из 5
                    </p>
                  </Rating>
                  {token && (
                    <>
                      <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
                      {data.release.your_vote ? (
                        <>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            ваша оценка: {data.release.your_vote}
                          </p>
                          {/* <p>Изменить</p> */}
                        </>
                      ) : (
                        ""
                        // <p>Оценить</p>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {data.release.vote_count}{" "}
                  {numberDeclension(
                    data.release.vote_count,
                    "голос",
                    "голоса",
                    "голосов"
                  )}
                </p>
                <Rating.Advanced
                  percentFilled={Math.floor(
                    (data.release.vote_5_count / data.release.vote_count) * 100
                  )}
                  className="mb-2"
                >
                  5
                </Rating.Advanced>
                <Rating.Advanced
                  percentFilled={Math.floor(
                    (data.release.vote_4_count / data.release.vote_count) * 100
                  )}
                  className="mb-2"
                >
                  4
                </Rating.Advanced>
                <Rating.Advanced
                  percentFilled={Math.floor(
                    (data.release.vote_3_count / data.release.vote_count) * 100
                  )}
                  className="mb-2"
                >
                  3
                </Rating.Advanced>
                <Rating.Advanced
                  percentFilled={Math.floor(
                    (data.release.vote_2_count / data.release.vote_count) * 100
                  )}
                  className="mb-2"
                >
                  2
                </Rating.Advanced>
                <Rating.Advanced
                  percentFilled={Math.floor(
                    (data.release.vote_1_count / data.release.vote_count) * 100
                  )}
                >
                  1
                </Rating.Advanced>
              </Card>
            )}
          </div>
          {data.release.related_releases.length > 0 && (
            <Card className="order-3">
              <div>
                <div className="flex justify-between py-2 border-b-2 border-black">
                  <h1>Связанные релизы</h1>
                  {data.release.related && (
                    <Link href={`/related/${data.release.related.id}`}>
                      <div className="flex items-center">
                        <p className="hidden sm:block">Показать все</p>
                        <span className="w-6 h-6 iconify mdi--arrow-right"></span>
                      </div>
                    </Link>
                  )}
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  {data.release.related_releases.map((release) => {
                    if (release.id == data.release.id) return null;
                    return <ReleaseLink key={release.id} {...release} />;
                  })}
                </div>
              </div>
            </Card>
          )}
          {data.release.screenshot_images.length > 0 && (
            <Card className="order-2 lg:order-1">
              <Carousel className="aspect-[16/10]">
                {data.release.screenshot_images.map(
                  (image: string, index: number) => (
                    <img key={index} className="object-cover" src={image} />
                  )
                )}
              </Carousel>
            </Card>
          )}
        </div>
        <div className="[grid-column:1] lg:[grid-column:2] flex flex-col gap-2"></div>
      </div>
    </main>
  ) : (
    <main className="flex h-[100dvh] w-full justify-center items-center">
      <Spinner />
    </main>
  );
};

{
  /* <Chip
  bg_color={
    data.release.grade.toFixed(1) == 0
      ? "hidden"
      : data.release.grade.toFixed(1) < 2
      ? "bg-red-500"
      : data.release.grade.toFixed(1) < 3
      ? "bg-orange-500"
      : data.release.grade.toFixed(1) < 4
      ? "bg-yellow-500"
      : "bg-green-500"
  }
  name={data.release.grade.toFixed(1)}
/> */
}

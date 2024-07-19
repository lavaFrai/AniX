"use client";
import { useUserStore } from "@/app/store/auth";
import { useEffect, useState } from "react";
import { fetchDataViaGet } from "../api/utils";
import { Spinner } from "../components/Spinner/Spinner";
import { Avatar, Card, Button, Table } from "flowbite-react";
import { Chip } from "../components/Chip/Chip";
import { unixToDate, minutesToTime } from "../api/utils";
import { ReleaseLink } from "../components/ReleaseLink/ReleaseLink";

export const ProfilePage = (props) => {
  const authUser = useUserStore((state) => state);
  const [user, setUser] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    async function _getData() {
      let url = `/api/profile/${props.id}`;
      if (authUser.token) {
        url += `?token=${authUser.token}`;
      }
      const data = await fetchDataViaGet(url);
      setUser(data.profile);
      setIsMyProfile(data.is_my_profile);
    }
    _getData();
  }, [authUser]);

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Spinner />
      </main>
    );
  }

  const hasSocials =
    user.vk_page != "" ||
    user.tg_page != "" ||
    user.tt_page != "" ||
    user.inst_page != "" ||
    user.discord_page != "" ||
    false;
  const socials = [
    {
      name: "vk",
      nickname: user.vk_page,
      icon: "fa6-brands--vk",
      urlPrefix: "https://vk.com",
    },
    {
      name: "telegram",
      nickname: user.tg_page,
      icon: "fa6-brands--telegram",
      urlPrefix: "https://t.me",
    },
    {
      name: "discord",
      nickname: user.discord_page,
      icon: "fa6-brands--discord",
    },
    {
      name: "tiktok",
      nickname: user.tt_page,
      icon: "fa6-brands--tiktok",
      urlPrefix: "https://tiktok.com",
    },
    {
      name: "instagram",
      nickname: user.inst_page,
      icon: "fa6-brands--instagram",
      urlPrefix: "https://instagram.com",
    },
  ];

  return (
    <main className="container flex flex-col gap-4 px-4 pt-4 pb-32 mx-auto overflow-hidden xl:flex-row sm:pb-4">
      <div className="flex flex-col gap-4">
        <Card className="max-w-full">
          <div className="flex gap-2">
            {isMyProfile && <Chip bg_color="bg-blue-500" name="Мой профиль" />}
            {user.is_banned && (
              <Chip bg_color="bg-red-500" name="Заблокирован" />
            )}
            {user.is_verified && (
              <Chip bg_color="bg-green-500" name="Подтвержден" />
            )}
            {/* {user.is_banned && <Chip bg_color="bg-red-500" name="Заблокирован" />} */}

            {/* <Chip bg="bg-blue-500" name={`Зарегистрирован: ${unixToDate(user.register_date)}`} /> */}
            {/* <Chip bg="bg-blue-500" name={`Последний вход: ${unixToDate(user.last_activity_time)}`} /> */}
          </div>
          <Avatar
            img={user.avatar}
            rounded={true}
            bordered={true}
            size="lg"
            className="justify-start"
          >
            <div className="space-y-1 font-medium dark:text-white">
              <div className="text-xl">{user.login}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 max-w-64">
                {user.status}
              </div>
            </div>
          </Avatar>
          {hasSocials && (
            <Button.Group
              outline={true}
              className="overflow-x-scroll scrollbar-none"
            >
              {socials.map((social) => {
                if (!social.nickname) return null;
                if (social.name == "discord") return (
                    <Button
                    color="light"
                    key={social.name}
                    as="a"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`iconify-color h-4 w-4 sm:h-6 sm:w-6 ${social.icon}`}
                      ></span>
                      {social.nickname}
                    </div>
                  </Button>
                )
                return (
                  <Button
                    color="light"
                    key={social.name}
                    href={`${social.urlPrefix}/${social.nickname}`}
                    className="[&:is(a)]:hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`iconify-color h-4 w-4 sm:h-6 sm:w-6 ${social.icon}`}
                      ></span>
                      {social.nickname}
                    </div>
                  </Button>
                );
              })}
            </Button.Group>
          )}
        </Card>
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 max-w-full">
            <h1>Активность</h1>
            <Table>
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell className="px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Регистрация
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {unixToDate(user.register_date)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Был(а) в сети
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {unixToDate(user.last_activity_time)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Комментарий
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.comment_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    друзей
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.friend_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    видео
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.video_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    коллекций
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.collection_count}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
          <Card className="flex-1 max-w-full">
            <h1>Статистика</h1>
            <Table>
              <Table.Body className="divide-y">
                <Table.Row>
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--123 "></span>
                    Просмотрено серий
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.watched_episode_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="hidden sm:table-row">
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--clock "></span>
                    Время просмотра
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-pre sm:whitespace-nowrap dark:text-white">
                    {minutesToTime(user.watched_time)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="table-row sm:hidden">
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-pre sm:whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--clock "></span>
                    {minutesToTime(user.watched_time)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--play "></span>
                    Смотрю
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.watching_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--note-multiple "></span>
                    В Планах
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.plan_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--tick "></span>
                    Просмотрено
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.completed_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--question-mark "></span>
                    Отложено
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.hold_on_count}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--erase "></span>
                    Брошено
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.dropped_count}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
        </div>
      </div>
      <div className="flex-1">
        <Card className="w-full max-w-full min-w-full">
          <h1>Недавно просмотренные</h1>
          <div className="grid justify-center sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-cols-[100%] gap-2 min-w-full">
            {user.history.map((release) => {
              return <ReleaseLink key={release.id} {...release} />;
            })}
          </div>
        </Card>
      </div>
    </main>
  );
};

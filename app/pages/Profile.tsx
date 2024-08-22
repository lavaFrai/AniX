"use client";
import { useUserStore } from "#/store/auth";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner/Spinner";
import { Avatar, Card, Button, Table } from "flowbite-react";
import { Chip } from "../components/Chip/Chip";
import { fetchDataViaGet, unixToDate, minutesToTime } from "../api/utils";
import { ReleaseCourusel } from "#/components/ReleaseCourusel/ReleaseCourusel";
import { ENDPOINTS } from "#/api/config";

export const ProfilePage = (props: any) => {
  const authUser = useUserStore((state) => state);
  const [user, setUser] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    async function _getData() {
      let url = `${ENDPOINTS.user.profile}/${props.id}`;
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

  const hasChips = user.is_verified || user.is_blocked || isMyProfile;

  return (
    <main className="container flex flex-col gap-4 px-4 pt-4 pb-32 mx-auto overflow-hidden sm:pb-4">
      {(user.is_banned || user.is_perm_banned) && (
        <div className="flex flex-col justify-between w-full p-4 border border-red-200 rounded-md md:flex-row bg-red-50 dark:bg-red-700 dark:border-red-600">
          <div className="mb-4 md:mb-0 md:me-4">
            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
              {user.is_perm_banned
                ? "Пользователь был заблокирован администрацией навсегда"
                : `Пользователь был заблокирован администрацией до
              ${unixToDate(user.ban_expires)}`}
            </h2>
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-200">
              {user.ban_reason}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Card className="max-w-full">
          {hasChips && (
            <div className="flex gap-2 overflow-x-auto scrollbar-thin">
              {isMyProfile && (
                <Chip bg_color="bg-blue-500" name="Мой профиль" />
              )}
              {user.is_blocked && (
                <Chip bg_color="bg-red-500" name="Заблокирован вами" />
              )}
              {user.is_verified && (
                <Chip bg_color="bg-green-500" name="Подтверждён" />
              )}
            </div>
          )}
          <Avatar
            img={user.avatar}
            rounded={true}
            bordered={true}
            size="lg"
            className="flex-col justify-start space-x-0 sm:flex-row sm:space-x-4"
          >
            <div className="mt-2 space-y-1 font-medium sm:mt-0 dark:text-white">
              <div className="text-xl">{user.login}</div>
              <p className="max-w-full text-sm text-gray-500 whitespace-pre-wrap dark:text-gray-400 sm:max-w-96">
                {user.status}
              </p>
            </div>
          </Avatar>
          {hasSocials && (
            <div className="flex gap-1 overflow-x-auto scrollbar-thin">
              {socials
                .filter((social: any) => {
                  if (social.nickname == "") {
                    return false;
                  }
                  return true;
                })
                .map((social: any) => {
                  if (social.name == "discord" && social.nickname != "")
                    return (
                      <Button color="light" key={social.name} as="a">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`iconify h-4 w-4 sm:h-6 sm:w-6 ${social.icon} dark:fill-white`}
                          ></span>
                          {social.nickname}
                        </div>
                      </Button>
                    );
                  return (
                    <Button
                      color="light"
                      key={social.name}
                      href={`${social.urlPrefix}/${social.nickname}`}
                      className="[&:is(a)]:hover:bg-gray-100"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`iconify h-4 w-4 sm:h-6 sm:w-6 ${social.icon} dark:fill-white`}
                        ></span>
                        {social.nickname}
                      </div>
                    </Button>
                  );
                })}
            </div>
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
                    {minutesToTime(user.watched_time) ||
                      "Нет просмотренных серий."}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="table-row sm:hidden">
                  <Table.Cell className="flex items-center px-0 font-medium text-gray-900 whitespace-pre sm:whitespace-nowrap dark:text-white">
                    <span className="w-4 h-4 mr-2 iconify mdi--clock "></span>
                    {minutesToTime(user.watched_time) ||
                      "Нет просмотренных серий."}
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
      {user.history.length > 0 && (
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800">
          <ReleaseCourusel
            sectionTitle="Недавно просмотренные"
            content={user.history}
          />
        </div>
      )}
    </main>
  );
};

"use client";

import { Modal } from "flowbite-react";
import { Spinner } from "../Spinner/Spinner";
import useSWR from "swr";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";
import { unixToDate } from "#/api/utils";
import { ProfileEditPrivacyModal } from "./Profile.EditPrivacyModal";
import { ProfileEditStatusModal } from "./Profile.EditStatusModal";
import { ProfileEditSocialModal } from "./Profile.EditSocialModal";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      `An error occurred while fetching the data. status: ${res.status}`
    );
    error.message = await res.json();
    throw error;
  }

  return res.json();
};

export const ProfileEditModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
}) => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [privacyModalSetting, setPrivacyModalSetting] = useState("none");
  const [privacySettings, setPrivacySettings] = useState({
    privacy_stats: 9,
    privacy_counts: 9,
    privacy_social: 9,
    privacy_friend_requests: 9,
  });
  const [socialBounds, setSocialBounds] = useState({
    vk: false,
    google: false,
  });
  const [status, setStatus] = useState("");
  const [login, setLogin] = useState("");

  const privacy_stat_act_social_text = {
    0: "Все пользователи",
    1: "Только друзья",
    2: "Только я",
    9: "Неизвестно",
  };
  const privacy_friend_req_text = {
    0: "Все пользователи",
    1: "Никто",
    9: "Неизвестно",
  };

  function _fetchInfo(url: string) {
    const { data, isLoading, error } = useSWR(url, fetcher);
    return [data, isLoading, error];
  }

  const [prefData, prefLoading, prefError] = _fetchInfo(
    `${ENDPOINTS.user.settings.my}?token=${props.token}`
  );
  const [loginData, loginLoading, loginError] = _fetchInfo(
    `${ENDPOINTS.user.settings.login.info}?token=${props.token}`
  );

  useEffect(() => {
    if (prefData) {
      setPrivacySettings({
        privacy_stats: prefData.privacy_stats,
        privacy_counts: prefData.privacy_counts,
        privacy_social: prefData.privacy_social,
        privacy_friend_requests: prefData.privacy_friend_requests,
      });
      setSocialBounds({
        vk: prefData.is_vk_bound || prefData.isVkBound || false,
        google: prefData.is_google_bound || prefData.isGoogleBound || false,
      });
      setStatus(prefData.status);
    }
  }, [prefData]);

  useEffect(() => {
    if (loginData) {
      setLogin(loginData.login);
    }
  }, [loginData]);

  return (
    <>
      <Modal
        show={props.isOpen}
        onClose={() => props.setIsOpen(false)}
        size={"7xl"}
      >
        <Modal.Header>Редактирование профиля</Modal.Header>
        <Modal.Body>
          {prefLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 pb-4 border-b-2 border-gray-300 border-solid">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 iconify mdi--user"></span>
                    <p className="text-xl font-bold">Профиль</p>
                  </div>
                  <p className="mx-1 text-base text-gray-500">
                    Изменения будут видны после перезагрузки страницы
                  </p>
                </div>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  disabled={prefData.is_change_avatar_banned}
                >
                  <p className="text-lg">Изменить фото профиля</p>
                  <p className="text-base text-gray-500">
                    {prefData.is_change_avatar_banned
                      ? `Заблокировано до ${unixToDate(
                          prefData.ban_change_avatar_expires,
                          "full"
                        )}`
                      : "Загрузить с устройства"}
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setStatusModalOpen(true);
                  }}
                >
                  <p className="text-lg">Изменить статус</p>
                  <p className="text-base text-gray-500 whitespace-pre">
                    {status}
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  disabled={prefData.is_change_login_banned}
                >
                  <p className="text-lg">Изменить никнейм</p>
                  <p className="text-base text-gray-500">
                    {prefData.is_change_login_banned
                      ? `Заблокировано до ${unixToDate(
                          prefData.ban_change_login_expires,
                          "full"
                        )}`
                      : login}
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setSocialModalOpen(true);
                  }}
                >
                  <p className="text-lg">Мои социальные сети</p>
                  <p className="text-base text-gray-500">
                    укажите ссылки на свои страницы в соц. сетях
                  </p>
                </button>
              </div>
              <div className="flex flex-col gap-2 pb-4 border-b-2 border-gray-300 border-solid">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 iconify mdi--anonymous "></span>
                  <p className="text-xl font-bold">Приватность</p>
                </div>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_stats");
                  }}
                >
                  <p className="text-lg">
                    Кто видит мою статистику, оценки и историю просмотра
                  </p>
                  <p className="text-base text-gray-500">
                    {
                      privacy_stat_act_social_text[
                        privacySettings.privacy_stats
                      ]
                    }
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_counts");
                  }}
                >
                  <p className="text-lg">
                    Кто видит в профиле мои комментарии, коллекции, видео и
                    друзей
                  </p>
                  <p className="text-base text-gray-500">
                    {
                      privacy_stat_act_social_text[
                        privacySettings.privacy_counts
                      ]
                    }
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_social");
                  }}
                >
                  <p className="text-lg">
                    Кто видит в профиле мои социальные сети
                  </p>
                  <p className="text-base text-gray-500">
                    {
                      privacy_stat_act_social_text[
                        privacySettings.privacy_social
                      ]
                    }
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_friend_requests");
                  }}
                >
                  <p className="text-lg">
                    Кто может отправлять мне заявки в друзья
                  </p>
                  <p className="text-base text-gray-500">
                    {
                      privacy_friend_req_text[
                        privacySettings.privacy_friend_requests
                      ]
                    }
                  </p>
                </button>
                <button className="p-2 text-left rounded-md hover:bg-gray-100">
                  <p className="text-lg">Блоклист</p>
                  <p className="text-base text-gray-500">
                    Список пользователей, которым запрещён доступ к вашей
                    странице
                  </p>
                </button>
              </div>
              <div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 iconify mdi--shield"></span>
                    <p className="text-xl font-bold">
                      Безопасность и привязка к сервисам
                    </p>
                  </div>
                  <p className="mx-1 text-base text-gray-500">
                    Не доступно для изменения в данном клиенте
                  </p>
                </div>
                <div className="p-2 mt-2 cursor-not-allowed">
                  <p className="text-lg">Привязка к сервисам</p>
                  <p className="text-base text-gray-500">
                    {socialBounds.vk || socialBounds.google
                      ? "Аккаунт привязан к:"
                      : "не привязан к сервисам"}{" "}
                    {socialBounds.vk && "ВК"}
                    {socialBounds.vk && socialBounds.google && ", "}
                    {socialBounds.google && "Google"}
                  </p>
                </div>
                <div className="p-2 cursor-not-allowed">
                  <p className="text-lg">Смена Эл. Почты или Пароля</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <ProfileEditPrivacyModal
        isOpen={privacyModalOpen}
        setIsOpen={setPrivacyModalOpen}
        token={props.token}
        setting={privacyModalSetting}
        privacySettings={privacySettings}
        setPrivacySettings={setPrivacySettings}
      />
      <ProfileEditStatusModal
        isOpen={statusModalOpen}
        setIsOpen={setStatusModalOpen}
        token={props.token}
        status={status}
        setStatus={setStatus}
      />
      <ProfileEditSocialModal
        isOpen={socialModalOpen}
        setIsOpen={setSocialModalOpen}
        token={props.token}
      />
    </>
  );
};

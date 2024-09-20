"use client";

import { FileInput, Label, Modal } from "flowbite-react";
import { Spinner } from "../Spinner/Spinner";
import useSWR from "swr";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";
import { b64toBlob, unixToDate } from "#/api/utils";
import { ProfileEditPrivacyModal } from "./Profile.EditPrivacyModal";
import { ProfileEditStatusModal } from "./Profile.EditStatusModal";
import { ProfileEditSocialModal } from "./Profile.EditSocialModal";
import { CropModal } from "../CropModal/CropModal";
import { useSWRConfig } from "swr";
import { useUserStore } from "#/store/auth";

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
  profile_id: number;
}) => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [tempAvatarUri, setTempAvatarUri] = useState(null);
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
  const { mutate } = useSWRConfig();
  const userStore = useUserStore();

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

  const handleFileRead = (e, fileReader) => {
    const content = fileReader.result;
    setTempAvatarUri(content);
  };

  const handleFilePreview = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      handleFileRead(e, fileReader);
    };
    fileReader.readAsDataURL(file);
  };

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

  useEffect(() => {
    if (avatarUri) {
      let block = avatarUri.split(";");
      let contentType = block[0].split(":")[1];
      let realData = block[1].split(",")[1];
      const blob = b64toBlob(realData, contentType);

      const formData = new FormData();
      formData.append("image", blob, "cropped.jpg");
      formData.append("name", "image");
      const uploadRes = fetch(
        `${ENDPOINTS.user.settings.avatar}?token=${props.token}`,
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => {
        if (res.ok) {
          mutate(
            `${ENDPOINTS.user.profile}/${props.profile_id}?token=${props.token}`
          );
          userStore.checkAuth();
        }
      });
    }
  }, [avatarUri]);

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
                    Некоторые изменения будут видны после перезагрузки страницы
                  </p>
                </div>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100"
                  disabled={prefData.is_change_avatar_banned}
                >
                  <Label htmlFor="dropzone-file" className="cursor-pointer">
                    <FileInput
                      id="dropzone-file"
                      className="hidden"
                      accept="image/jpg, image/jpeg, image/png"
                      onChange={(e) => {
                        handleFilePreview(e.target.files[0]);
                        setAvatarModalOpen(true);
                      }}
                    />
                    <div>
                      <p className="text-lg">Изменить фото профиля</p>
                      <p className="text-base text-gray-500">
                        {prefData.is_change_avatar_banned
                          ? `Заблокировано до ${unixToDate(
                              prefData.ban_change_avatar_expires,
                              "full"
                            )}`
                          : "Загрузить с устройства"}
                      </p>
                    </div>
                  </Label>
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
                    <span className="w-8 h-8 iconify mdi--link"></span>
                    <p className="text-xl font-bold">Привязка к сервисам</p>
                  </div>
                  <p className="mx-1 text-base text-gray-500">
                    Недоступно для изменения в данном клиенте
                  </p>
                </div>
                <div className="p-2 mt-2 cursor-not-allowed">
                  <p className="text-lg">Связанные аккаунты</p>
                  <p className="text-base text-gray-500">
                    {socialBounds.vk || socialBounds.google
                      ? "Аккаунт привязан к:"
                      : "не привязан к сервисам"}{" "}
                    {socialBounds.vk && "ВК"}
                    {socialBounds.vk && socialBounds.google && ", "}
                    {socialBounds.google && "Google"}
                  </p>
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
        profile_id={props.profile_id}
      />
      <ProfileEditSocialModal
        isOpen={socialModalOpen}
        setIsOpen={setSocialModalOpen}
        token={props.token}
        profile_id={props.profile_id}
      />
      <CropModal
        src={tempAvatarUri}
        setSrc={setAvatarUri}
        setTempSrc={setTempAvatarUri}
        // setImageData={setImageData}
        aspectRatio={1 / 1}
        guides={true}
        quality={100}
        isOpen={avatarModalOpen}
        setIsOpen={setAvatarModalOpen}
        forceAspect={true}
        width={600}
        height={600}
      />
    </>
  );
};

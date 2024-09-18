"use client";

import { Modal } from "flowbite-react";
import { Spinner } from "../Spinner/Spinner";
import useSWR from "swr";
import { ENDPOINTS } from "#/api/config";

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

  const privacy_stat_act_social_text = {
    0: 'Все пользователи',
    1: 'Только друзья',
    2: 'Только я'
  }
  const privacy_friend_req_text = {
    0: 'Все пользователи',
    1: 'Никто'
  }

  const { data, isLoading, error } = useSWR(
      `${ENDPOINTS.user.settings.my}?token=${props.token}`,
      fetcher
      );
      
  const socialBounds = {
    'vk': data.is_vk_bound || data.isVkBound || false,
    'google': data.is_google_bound || data.isGoogleBound || false
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"7xl"}
    >
      <Modal.Header>Редактирование профиля</Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 pb-4 border-b-2 border-gray-300 border-solid">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 iconify mdi--user"></span>
                <p className="text-xl font-bold">Профиль</p>
              </div>
              <div>
                <p className="text-lg">Изменить фото профиля</p>
                <p className="text-base text-gray-500">Загрузить с устройства</p>
              </div>
              <div>
                <p className="text-lg">Изменить статус</p>
                <p className="text-base text-gray-500">{data.status}</p>
              </div>
              <div>
                <p className="text-lg">Изменить никнейм</p>
              </div>
              <div>
                <p className="text-lg">Мои социальные сети</p>
                <p className="text-base text-gray-500">
                  укажите ссылки на свои страницы в соц. сетях
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 pb-4 border-b-2 border-gray-300 border-solid">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 iconify mdi--anonymous "></span>
                <p className="text-xl font-bold">Приватность</p>
              </div>
              <div>
                <p className="text-lg">
                  Кто видит мою статистику, оценки и историю просмотра
                </p>
                <p className="text-base text-gray-500">{privacy_stat_act_social_text[data.privacy_stats]}</p>
              </div>
              <div>
                <p className="text-lg">
                  Кто видит в профиле мои комментарии, коллекции, видео и друзей
                </p>
                <p className="text-base text-gray-500">{privacy_stat_act_social_text[data.privacy_counts]}</p>
              </div>
              <div>
                <p className="text-lg">
                  Кто видит в профиле мои социальные сети
                </p>
                <p className="text-base text-gray-500">{privacy_stat_act_social_text[data.privacy_social]}</p>
              </div>
              <div>
                <p className="text-lg">
                  Кто может отправлять мне заявки в друзья
                </p>
                <p className="text-base text-gray-500">{privacy_friend_req_text[data.privacy_friend_requests]}</p>
              </div>
              <div>
                <p className="text-lg">Блоклист</p>
                <p className="text-base text-gray-500">
                  Список пользователей, которым запрещён доступ к вашей странице
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 iconify mdi--shield"></span>
                <p className="text-xl font-bold">
                  Безопасность и привязка к сервисам
                </p>
              </div>
              <div>
                <p className="text-lg">Изменить Email или Пароль</p>
                <p className="text-base text-gray-500">
                  Изменить возможно только в мобильном приложении
                </p>
              </div>
              <div>
                <p className="text-lg">Привязка к сервисам</p>
                <p className="text-base text-gray-500">
                  Изменить возможно только в мобильном приложении
                </p>
                <p className="text-base text-gray-500">
                  {(socialBounds.vk || socialBounds.google) ? "Аккаунт привязан к:" : "не привязан к сервисам"} {socialBounds.vk && "ВК"}{socialBounds.vk && socialBounds.google && ", "}{socialBounds.google && "Google"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

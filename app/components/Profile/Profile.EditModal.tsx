import { Modal } from "flowbite-react";

export const ProfileEditModal = (props: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) => {
  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"7xl"}
    >
        <Modal.Header>Редактирование профиля</Modal.Header>
        <Modal.Body>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 pb-4 border-b-2 border-gray-300 border-solid">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 iconify mdi--user"></span>
                        <p className="text-xl font-semibold">Профиль</p>
                    </div>
                    <div>
                        <p className="text-lg">Изменить аватар</p>
                    </div>
                    <div>
                        <p className="text-lg">Изменить статус</p>
                        <p className="text-lg text-gray-500">статус</p>
                    </div>
                    <div>
                        <p className="text-lg">Изменить никнейм</p>
                        <p className="text-lg text-gray-500">никнейм</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 pb-4 border-b-2 border-gray-300 border-solid">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 iconify mdi--anonymous "></span>
                        <p className="text-xl font-semibold">Приватность</p>
                    </div>
                    <div>
                        <p className="text-lg">Кто видит мою статистику, оценки и историю просмотра</p>
                        <p className="text-lg text-gray-500">Все пользователи</p>
                    </div>
                    <div>
                        <p className="text-lg">Кто видит в профиле мои комментарии, коллекции, видео и друзей</p>
                        <p className="text-lg text-gray-500">Все пользователи</p>
                    </div>
                    <div>
                        <p className="text-lg">Кто видит в профиле мои социальные сети</p>
                        <p className="text-lg text-gray-500">Все пользователи</p>
                    </div>
                    <div>
                        <p className="text-lg">Кто может отправлять мне заявки в друзья</p>
                        <p className="text-lg text-gray-500">Все пользователи</p>
                    </div>
                    <div>
                        <p className="text-lg">Блоклист</p>
                        <p className="text-lg text-gray-500">Список пользователей, которым запрещён доступ к вашей странице</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 iconify mdi--shield"></span>
                        <p className="text-xl font-semibold">Безопасность и привязка к сервисам</p>
                    </div>
                    <div>
                        <p className="text-lg">Изменить Email или Пароль</p>
                        <p className="text-lg text-gray-500">Изменить возможно только в мобильном приложении</p>
                    </div>
                    <div>
                        <p className="text-lg">Привязка к сервисам</p>
                        <p className="text-lg text-gray-500">Изменить возможно только в мобильном приложении</p>
                        <p className="text-lg text-gray-500">Аккаунт привязан к: сер1, сер2</p>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>
  );
};

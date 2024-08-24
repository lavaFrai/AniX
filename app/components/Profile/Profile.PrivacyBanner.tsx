export const ProfilePrivacyBanner = (props: { is_privacy: boolean }) => {
  return (
    <>
      {props.is_privacy && (
        <div className="flex flex-col justify-between w-full p-4 border border-gray-200 rounded-md md:flex-row bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="mb-4 md:mb-0 md:me-4">
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-200">
              У пользователя установлены настройки приватности. Некоторая
              информация для вас может быть недоступна.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

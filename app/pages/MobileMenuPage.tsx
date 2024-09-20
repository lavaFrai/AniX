"use client";
import { Card } from "flowbite-react";
import { useUserStore } from "#/store/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SettingsModal } from "#/components/SettingsModal/SettingsModal";
import { useEffect, useState } from "react";

export const MenuPage = () => {
  const userStore = useUserStore();
  const router = useRouter();
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  useEffect(() => {
    if (!userStore.user) {
      router.push("/");
    }
  }, [userStore.user]);

  return (
    <>
      {userStore.user && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/profile/${userStore.user.id}`} className="flex-1">
              <Card>
                <div className="flex items-center gap-4">
                  <img
                    src={userStore.user.avatar}
                    alt=""
                    className="w-16 h-16 rounded-full sm:w-28 sm:h-28"
                  />
                  <div>
                    <p className="text-xl sm:text-2xl">
                      {userStore.user.login}
                    </p>
                    <p className="text-sm text-gray-400 whitespace-pre sm:text-base dark:text-gray-300">
                      {userStore.user.status}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
            <div className="flex flex-1 h-full gap-2 sm:flex-col">
              <button
                className="flex-1"
                onClick={() => {
                  userStore.logout();
                }}
              >
                <Card>
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <span
                      className={`iconify material-symbols--logout-rounded w-6 h-6 text-red-500`}
                    ></span>
                    <p className="text-red-500">Выйти</p>
                  </div>
                </Card>
              </button>
              <button
                className="flex-1"
                onClick={() => {
                  setIsSettingModalOpen(true);
                }}
              >
                <Card className="flex-1">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <span
                      className={`iconify material-symbols--settings-outline-rounded w-6 h-6`}
                    ></span>
                    <p>Настройки</p>
                  </div>
                </Card>
              </button>
            </div>
          </div>
          <Link href="/favorites" className="flex-1">
            <Card>
              <div className="flex items-center gap-2">
                <span
                  className={`iconify material-symbols--favorite-outline w-6 h-6`}
                ></span>
                <p>Избранное</p>
              </div>
            </Card>
          </Link>
          <Link href="/collections" className="flex-1">
            <Card>
              <div className="flex items-center gap-2">
                <span
                  className={`iconify material-symbols--collections-bookmark-outline w-6 h-6`}
                ></span>
                <p>Коллекции</p>
              </div>
            </Card>
          </Link>
          <Link href="/history" className="flex-1">
            <Card>
              <div className="flex items-center gap-2">
                <span
                  className={`iconify material-symbols--history w-6 h-6`}
                ></span>
                <p>История</p>
              </div>
            </Card>
          </Link>
          <SettingsModal
            isOpen={isSettingModalOpen}
            setIsOpen={setIsSettingModalOpen}
          />
        </div>
      )}
    </>
  );
};

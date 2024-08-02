"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "#/store/auth";
import { usePreferencesStore } from "#/store/preferences";
import {
  Dropdown,
  Modal,
  Button,
  DarkThemeToggle,
  useThemeMode,
} from "flowbite-react";
import { useState } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const userStore: any = useUserStore((state) => state);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const navLinks = [
    {
      id: 1,
      icon: "material-symbols--home-outline",
      iconActive: "material-symbols--home",
      title: "Домашняя",
      href: "/",
      withAuthOnly: false,
      mobileMenu: false,
    },
    {
      id: 2,
      icon: "material-symbols--search",
      iconActive: "material-symbols--search",
      title: "Поиск",
      href: "/search",
      withAuthOnly: false,
      mobileMenu: false,
    },
    {
      id: 3,
      icon: "material-symbols--bookmarks-outline",
      iconActive: "material-symbols--bookmarks",
      title: "Закладки",
      href: "/bookmarks",
      withAuthOnly: true,
      mobileMenu: false,
    },
    {
      id: 4,
      icon: "material-symbols--favorite-outline",
      iconActive: "material-symbols--favorite",
      title: "Избранное",
      href: "/favorites",
      withAuthOnly: true,
      mobileMenu: true,
    },
    {
      id: 5,
      icon: "material-symbols--history",
      iconActive: "material-symbols--history",
      title: "История",
      href: "/history",
      withAuthOnly: true,
      mobileMenu: true,
    },
  ];

  return (
    <>
      <header className="fixed bottom-0 left-0 z-50 w-full text-white bg-black sm:sticky sm:top-0">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <nav className="flex gap-4">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`flex-col items-center sm:flex-row ${
                    link.withAuthOnly && !userStore.isAuth
                      ? "hidden"
                      : link.mobileMenu
                      ? "hidden sm:flex"
                      : "flex"
                  }`}
                >
                  <span
                    className={`iconify ${
                      pathname == link.href ? link.iconActive : link.icon
                    } w-6 h-6`}
                  ></span>
                  <span
                    className={`${
                      pathname == link.href ? "font-bold" : ""
                    } text-xs sm:text-base`}
                  >
                    {link.title}
                  </span>
                </Link>
              );
            })}
          </nav>
          {userStore.isAuth ? (
            <div className="flex flex-col items-center justify-center gap-1 text-xs sm:flex-row sm:text-base">
              <img
                src={userStore.user.avatar}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <Dropdown
                label={userStore.user.login}
                inline={true}
                dismissOnClick={true}
                theme={{
                  arrowIcon:
                    "ml-1 w-4 h-4 [transform:rotateX(180deg)] sm:transform-none",
                }}
              >
                <Dropdown.Item className="text-sm md:text-base">
                  <Link
                    href={`/profile/${userStore.user.id}`}
                    className="flex items-center gap-1"
                  >
                    <span
                      className={`iconify ${
                        pathname == `/profile/${userStore.user.id}`
                          ? "font-bold mdi--user"
                          : "mdi--user-outline"
                      } w-4 h-4 sm:w-6 sm:h-6`}
                    ></span>
                    <span>Профиль</span>
                  </Link>
                </Dropdown.Item>
                {navLinks.map((link) => {
                  return (
                    <Dropdown.Item
                      key={link.id + "_mobile"}
                      className={`${
                        link.mobileMenu ? "block sm:hidden" : "hidden"
                      } text-sm md:text-base`}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-1`}
                      >
                        <span
                          className={`iconify ${
                            pathname == link.href ? link.iconActive : link.icon
                          } w-4 h-4 sm:w-6 sm:h-6`}
                        ></span>
                        <span
                          className={`${
                            pathname == link.href ? "font-bold" : ""
                          }`}
                        >
                          {link.title}
                        </span>
                      </Link>
                    </Dropdown.Item>
                  );
                })}
                <Dropdown.Item
                  onClick={() => {
                    setIsSettingModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-sm md:text-base"
                >
                  <span
                    className={`iconify material-symbols--settings-outline-rounded w-4 h-4 sm:w-6 sm:h-6`}
                  ></span>
                  <span>Настройки</span>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    userStore.logout();
                  }}
                  className="flex items-center gap-1 text-sm md:text-base"
                >
                  <span
                    className={`iconify material-symbols--logout-rounded w-4 h-4 sm:w-6 sm:h-6`}
                  ></span>
                  <span>Выйти</span>
                </Dropdown.Item>
              </Dropdown>
            </div>
          ) : (
            <Dropdown
              label="Меню"
              inline={true}
              dismissOnClick={true}
              theme={{
                arrowIcon:
                  "ml-1 w-4 h-4 [transform:rotateX(180deg)] sm:transform-none",
              }}
            >
              <Dropdown.Item className="text-sm md:text-base">
                <Link
                  href="/login"
                  className="flex items-center gap-1"
                >
                  <span
                    className={`w-4 h-4 sm:w-6 sm:h-6 iconify ${
                      pathname == "/login"
                        ? "mdi--user-circle"
                        : "mdi--user-circle-outline"
                    }`}
                  ></span>
                  <span
                    className={`${
                      pathname == "/login" ? "font-bold" : ""
                    } text-xs sm:text-base`}
                  >
                    Войти
                  </span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setIsSettingModalOpen(true);
                }}
                className="flex items-center gap-1 text-sm md:text-base"
              >
                <span
                  className={`iconify material-symbols--settings-outline-rounded w-4 h-4 sm:w-6 sm:h-6`}
                ></span>
                <span>Настройки</span>
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </header>
      <SettingsModal
        isOpen={isSettingModalOpen}
        setIsOpen={setIsSettingModalOpen}
      />
    </>
  );
};

const SettingsModal = (props: { isOpen: boolean; setIsOpen: any }) => {
  const preferenceStore = usePreferencesStore();

  const { computedMode, setMode } = useThemeMode();

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <Modal.Header>Настройки</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="font-bold dark:text-white">Тема</p>
            <Button.Group>
              <Button
                color={computedMode == "light" ? "blue" : "gray"}
                onClick={() => setMode("light")}
              >
                Светлая
              </Button>
              <Button
                color={computedMode == "dark" ? "blue" : "gray"}
                onClick={() => setMode("dark")}
              >
                Темная
              </Button>
            </Button.Group>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

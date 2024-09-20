"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "#/store/auth";
import { Dropdown } from "flowbite-react";
import { useState } from "react";
import Image from "next/image";
import { SettingsModal } from "#/components/SettingsModal/SettingsModal";

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
      icon: "material-symbols--collections-bookmark-outline",
      iconActive: "material-symbols--collections-bookmark",
      title: "Коллекции",
      href: "/collections",
      withAuthOnly: true,
      mobileMenu: true,
    },
    {
      id: 6,
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
        <div className="container flex items-center justify-center gap-4 px-4 py-4 mx-auto lg:justify-between lg:gap-0">
          <nav className="flex gap-4">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`flex-col items-center lg:flex-row ${
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
                    } text-sm sm:text-base`}
                  >
                    {link.title}
                  </span>
                </Link>
              );
            })}
          </nav>
          {userStore.isAuth ? (
            <>
              <div className="flex-col items-center justify-end hidden text-sm md:flex lg:gap-1 lg:justify-center lg:flex-row lg:text-base">
                <Image
                  src={userStore.user.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full"
                  width={24}
                  height={24}
                />
                <Dropdown
                  label={userStore.user.login}
                  inline={true}
                  dismissOnClick={true}
                  theme={{
                    arrowIcon:
                      "ml-1 w-4 h-4 [transform:rotateX(180deg)] sm:transform-none",
                    floating: {
                      target: "text-sm sm:text-base",
                    },
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
                        } w-6 h-6`}
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
                              pathname == link.href
                                ? link.iconActive
                                : link.icon
                            } w-6 h-6`}
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
                      className={`iconify material-symbols--settings-outline-rounded w-6 h-6`}
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
                      className={`iconify material-symbols--logout-rounded w-6 h-6`}
                    ></span>
                    <span>Выйти</span>
                  </Dropdown.Item>
                </Dropdown>
              </div>
              <div className="block md:hidden">
                <Link
                  href={"/menu"}
                  className={`flex flex-col items-center justify-end text-sm md:hidden lg:gap-1 lg:justify-center lg:flex-row lg:text-base ${
                    pathname == "/menu" ? "font-bold" : ""
                  }`}
                >
                  <Image
                    src={userStore.user.avatar}
                    alt=""
                    className="w-6 h-6 rounded-full"
                    width={24}
                    height={24}
                  />
                  <p>{userStore.user.login}</p>
                </Link>
              </div>
            </>
          ) : (
            <Dropdown
              label=""
              renderTrigger={() => (
                <div className="flex flex-col items-center text-sm md:text-base">
                  <span className="w-6 h-6 iconify mdi--menu"></span>
                  <span>Меню</span>
                </div>
              )}
              inline={true}
              dismissOnClick={true}
              theme={{
                arrowIcon:
                  "ml-1 w-4 h-4 [transform:rotateX(180deg)] sm:transform-none",
              }}
            >
              <Dropdown.Item className="text-sm md:text-base">
                <Link
                  href={
                    pathname != "/login" ? `/login?redirect=${pathname}` : "#"
                  }
                  className="flex items-center gap-1"
                >
                  <span
                    className={`w-6 h-6 sm:w-6 sm:h-6 iconify ${
                      pathname == "/login"
                        ? "mdi--user-circle"
                        : "mdi--user-circle-outline"
                    }`}
                  ></span>
                  <span
                    className={`${
                      pathname == "/login" ? "font-bold" : ""
                    } text-sm sm:text-base`}
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
                  className={`iconify material-symbols--settings-outline-rounded w-6 h-6 sm:w-6 sm:h-6`}
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

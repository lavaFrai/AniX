"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/app/store/auth";

export const Navbar = () => {
  const pathname = usePathname();
  const userStore = useUserStore();

  const isNotAuthorizedStyle = "text-gray-700";
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
      mobileMenu: true,
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
    <header className="fixed bottom-0 left-0 z-50 w-full text-white bg-black sm:sticky sm:top-0">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <nav className="flex gap-4">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`flex-col items-center sm:flex-row ${
                  link.mobileMenu ? "hidden sm:flex" : "flex"
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
        {userStore.user ? (
          <div className="flex items-center justify-center gap-2">
            <img src={userStore.user.avatar} alt="" className="w-8 h-8 rounded-full" />
            <p>{userStore.user.login}</p>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center gap-1 justify-cen ter sm:flex-row"
          >
            <span
              className={`w-6 h-6 iconify ${
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
        )}
      </div>
    </header>
  );
};

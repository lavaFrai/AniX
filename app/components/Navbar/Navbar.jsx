"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const navLinks = [
    {
      id: 1,
      icon: "material-symbols--home-outline",
      iconActive: "material-symbols--home",
      title: "Домашняя",
      href: "/",
    },
    {
      id: 2,
      icon: "material-symbols--search",
      iconActive: "material-symbols--search",
      title: "Поиск",
      href: "/search",
    },
    {
      id: 3,
      icon: "material-symbols--bookmarks-outline",
      iconActive: "material-symbols--bookmarks",
      title: "Закладки",
      href: "/bookmarks",
    },
    {
      id: 4,
      icon: "material-symbols--favorite-outline",
      iconActive: "material-symbols--favorite",
      title: "Избранное",
      href: "/favorites",
    },
    {
      id: 5,
      icon: "material-symbols--history",
      iconActive: "material-symbols--history",
      title: "История",
      href: "/history",
    },
  ];

  return (
    <header className="bg-black text-white sm:sticky sm:top-0 left-0 z-50 fixed bottom-0 w-full">
      <div className="px-4 py-4">
        <nav className="flex gap-4">
          {navLinks.map((link) => {
            return <Link key={link.id} href={link.href} className="flex items-center flex-col sm:flex-row"><span className={`iconify ${pathname == link.href ? link.iconActive : link.icon} w-6 h-6`}></span><span className={`${pathname == link.href ? "font-bold" : ""} text-xs sm:text-base`}>{link.title}</span></Link>;
          })}
        </nav>
      </div>
    </header>
  );
};

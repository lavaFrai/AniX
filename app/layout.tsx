import "./globals.css";
import { App } from "./App";
import { ThemeModeScript } from "flowbite-react";

export const metadata = {
  keywords: ["anix", "anixart", "anime", "аниксарт", "аниме"],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    template: "AniX | %s",
    default: "AniX | Домашняя",
  },
  description: "Неофициальное приложение для anixart.tv",
  openGraph: {
    url: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`,
    images: [
      {
        url: `${
          process.env.VERCEL_URL
            ? "https://" + process.env.VERCEL_URL
            : "http://localhost:" + process.env.PORT || 3000
        }/opengraph.png`, // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <App>{children}</App>
    </html>
  );
}

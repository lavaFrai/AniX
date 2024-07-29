"use client";
import { useUserStore } from "./store/auth";
import { Navbar } from "./components/Navbar/Navbar";
import { Inter } from "next/font/google";
import { useEffect } from "react";
const inter = Inter({ subsets: ["latin"] });

export const App = (props) => {
  const userStore = useUserStore((state) => state);
  useEffect(() => {
    userStore.checkAuth();
  }, []);

  return (
    <body className={`${inter.className} overflow-x-hidden`}>
      <Navbar />
      {props.children}
    </body>
  );
};

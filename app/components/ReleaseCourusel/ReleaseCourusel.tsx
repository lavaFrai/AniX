"use client";
import { useEffect } from "react";
import { ReleaseLink } from "../ReleaseLink/ReleaseLink";
import Link from "next/link";

import Styles from "./ReleaseCourusel.module.css";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export const ReleaseCourusel = (props: {
  sectionTitle: string;
  showAllLink?: string;
  content: any;
}) => {
  useEffect(() => {
    const options: any = {
      direction: "horizontal",
      spaceBetween: 8,
      allowTouchMove: true,
      slidesPerView: "auto",
      navigation: {
        enabled: false,
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        450: {
          navigation: {
            enabled: true,
          },
        },
      },
      modules: [Navigation],
    };
    new Swiper(".swiper", options);
  }, []);

  return (
    <section className={`${Styles.section}`}>
      <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          {props.sectionTitle}
        </h1>
        {props.showAllLink && (
          <Link href={props.showAllLink}>
            <div className="flex items-center">
              <p className="hidden text-xl font-bold sm:block">Показать все</p>
              <span className="w-6 h-6 iconify mdi--arrow-right"></span>
            </div>
          </Link>
        )}
      </div>
      <div className="m-4">
        <div className="swiper">
          <div className="swiper-wrapper">
            {props.content.map((release) => {
              return (
                <div
                  className="swiper-slide"
                  key={release.id}
                  style={{ width: "fit-content" }}
                >
                  <div className="xl:w-[600px] sm:w-[400px] w-[80vw] aspect-video">
                    <ReleaseLink {...release} />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={`swiper-button-prev ${Styles["swiper-button"]} after:iconify after:material-symbols--chevron-left aspect-square bg-black bg-opacity-25 backdrop-blur rounded-full after:bg-white`}
            style={
              { "--swiper-navigation-size": "64px" } as React.CSSProperties
            }
          ></div>
          <div
            className={`swiper-button-next ${Styles["swiper-button"]} after:iconify after:material-symbols--chevron-right aspect-square bg-black bg-opacity-25 backdrop-blur rounded-full after:bg-white`}
            style={
              { "--swiper-navigation-size": "64px" } as React.CSSProperties
            }
          ></div>
        </div>
      </div>
    </section>
  );
};

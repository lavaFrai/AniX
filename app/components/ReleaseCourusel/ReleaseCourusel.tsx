"use client";
import { ReleaseLink } from "../ReleaseLink/ReleaseLink";
import Link from "next/link";

import { Swiper, SwiperSlide } from 'swiper/react';
import Styles from "./ReleaseCourusel.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export const ReleaseCourusel = (props: {
  sectionTitle: string;
  showAllLink?: string;
  content: any;
}) => {
  return (
    <section className={Styles.section}>
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
      <div className="my-4">
        <Swiper
          modules={[Navigation]}
          spaceBetween={8}
          slidesPerView={'auto'}
          direction={'horizontal'}
          rewind={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          }}
          allowTouchMove={true}
          breakpoints={{
            1800: {
              initialSlide: 1,
              centeredSlides: true
            }
          }}
          className={Styles.swiper}
        >
            {props.content.map((release) => {
              return (
                <SwiperSlide
                  key={release.id}
                  className="xl:max-w-[600px] sm:max-w-[400px] aspect-video"
                >
                  <ReleaseLink {...release} />
                </SwiperSlide>
              );
            })}
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
        </Swiper>
        {/* <div className={`swiper ${Styles["swiper"]}`}>
          <div className="swiper-wrapper">
          </div>
          
        </div> */}
      </div>
    </section>
  );
};

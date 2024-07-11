"use client";
import { ReleaseLink } from "../ReleaseLink/ReleaseLink";
export const ReleaseCourusel = (props) => {
  return (
    <section className="group relative">
      <div className="flex justify-between border-b-2 border-black px-4">
        <h1 className="font-bold text-md sm:text-xl">{props.sectionTitle}</h1>
        <a href={props.showAllLink}>
          <div className="flex items-center">
            <p className="font-bold hidden sm:block text-xl">Показать все</p>
            <span className="iconify mdi--arrow-right w-6 h-6"></span>
          </div>
        </a>
      </div>
      <div
        className="flex gap-2 overflow-x-scroll p-4 scrollbar-none"
        id={props.id}
      >
        {props.content.map((release) => {
          return <ReleaseLink key={release.id} {...release} />;
        })}
      </div>
    </section>
  );
};

"use client";

import { Card, Carousel, CustomFlowbiteTheme } from "flowbite-react";
import { ReleaseLink } from "#/components/ReleaseLink/ReleaseLink";
import Link from "next/link";

const CarouselTheme: CustomFlowbiteTheme["carousel"] = {
  root: {
    base: "relative h-full w-full max-w-[300px]",
  },
};

export const ReleaseInfoRelated = (props: {
  release_id: number;
  related: any;
  related_releases: any;
}) => {
  return (
    <Card>
      <div className="flex justify-between py-2 border-b-2 border-black dark:border-white">
        <h1>Связанные релизы</h1>
        {props.related && (
          <Link href={`/related/${props.related.id}`}>
            <div className="flex items-center">
              <p className="hidden xl:block">Показать все</p>
              <span className="w-6 h-6 iconify mdi--arrow-right"></span>
            </div>
          </Link>
        )}
      </div>
      <div className="flex justify-center mt-2">
        <Carousel pauseOnHover={true} theme={CarouselTheme}>
          {props.related_releases
            .filter((release: any) => {
              if (release.id == props.release_id) {
                return false;
              }
              return true;
            })
            .map((release: any) => {
              return (
                <ReleaseLink key={release.id} {...release} type={"poster"} />
              );
            })}
        </Carousel>
      </div>
    </Card>
  );
};

import { Card, Carousel } from "flowbite-react";
import Image from "next/image";

export const ReleaseInfoScreenshots = (props: { images: string[] }) => {
  return (
    <Card>
      <Carousel className="aspect-[16/10]">
        {props.images.map((image: string, index: number) => (
          <Image
            key={index}
            className="object-cover"
            src={image}
            width={400}
            height={300}
            alt=""
          />
        ))}
      </Carousel>
    </Card>
  );
};

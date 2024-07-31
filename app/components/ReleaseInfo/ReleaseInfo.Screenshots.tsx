import { Card, Carousel } from "flowbite-react";

export const ReleaseInfoScreenshots = (props: {
  images: string[];
}) => {
  return (
    <Card>
      <Carousel className="aspect-[16/10]">
        {props.images.map((image: string, index: number) => (
          <img key={index} className="object-cover" src={image} />
        ))}
      </Carousel>
    </Card>
  );
};

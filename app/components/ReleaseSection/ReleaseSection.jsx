
import { ReleaseLink } from "../ReleaseLink/ReleaseLink";

export const ReleaseSection = (props) => {
  return (
    <section>
      <div className="flex justify-between px-4 border-b-2 border-black">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          {props.sectionTitle}
        </h1>
      </div>
      <div className="m-4">
        <div className="grid justify-center sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] grid-cols-[100%] gap-2 min-w-full">
          {props.content.map((release) => {
            return (
              <div
                key={release.id}
                className="w-full h-full aspect-video"
              >
                <ReleaseLink {...release} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

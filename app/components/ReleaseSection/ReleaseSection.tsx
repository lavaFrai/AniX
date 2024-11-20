import { ReleaseLink } from "../ReleaseLink/ReleaseLink";

export const ReleaseSection = (props: {
  sectionTitle?: string;
  content: any;
}) => {
  return (
    <section>
      {props.sectionTitle && (
        <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
          <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
            {props.sectionTitle}
          </h1>
        </div>
      )}
      <div className="m-4">
        <div className="lg:justify-center lg:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4 lg:gap-2 min-w-full flex flex-col lg:grid">
          {props.content.map((release) => {
            return (
              <div key={release.id} className="w-full h-full lg:aspect-video">
                <ReleaseLink {...release} />
              </div>
            );
          })}
          {props.content.length == 1 && <div></div>}
        </div>
      </div>
    </section>
  );
};

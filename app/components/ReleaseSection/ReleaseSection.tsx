import { ReleaseLink } from "../ReleaseLink/ReleaseLink";

export const ReleaseSection = (props: {sectionTitle?: string, content: any}) => {
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
        <div className="grid justify-center sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] grid-cols-[100%] gap-2 min-w-full">
          {props.content.map((release) => {
            return (
              <div key={release.id} className="w-full h-full aspect-video">
                <ReleaseLink {...release} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

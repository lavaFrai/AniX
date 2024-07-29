import { ReleaseLink169 } from "./ReleaseLink.16_9";
import { ReleaseLinkPoster } from "./ReleaseLink.Poster";

export const ReleaseLink = (props: any) => {
  const type = props.type || "16_9";

  if (type == "16_9") {
    return <ReleaseLink169 {...props} />;
  }
  if (type == "poster") {
    return <ReleaseLinkPoster {...props} />;
  }
};

export const Chip = (props: {
  icon_name?: string;
  icon_color?: string;
  name?: string;
  name_2?: string;
  devider?: string;
  bg_color?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={`px-2 sm:px-4 py-0.5 sm:py-1 rounded-sm ${
        props.bg_color || "bg-gray-500"
      } ${props.icon_name ? "flex items-center justify-center gap-1" : ""}`}
      style={props.style || {}}
    >
      {props.icon_name && (
        <span
          className={`iconify w-4 h-4 sm:w-6 sm:h-6 ${props.icon_name}`}
          style={
            {
              "color": "var(--icon-color)",
              "--icon-color": props.icon_color || "#fff",
            } as React.CSSProperties
          }
        ></span>
      )}
      <p className="text-xs text-white xl:text-base">
        {props.name}
        {props.name && props.devider ? props.devider : " "}
        {props.name_2}
      </p>
    </div>
  );
};

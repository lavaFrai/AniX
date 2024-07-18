export const Chip = (props) => {
  return (
    <div className={`rounded-sm ${props.bg_color || "bg-gray-500"}`}>
      <p className="px-2 sm:px-4 py-0.5 sm:py-1 text-xs xl:text-base text-white">
        {props.name}
        {props.name && props.devider ? props.devider : " "}
        {props.name_2}
      </p>
    </div>
  );
};

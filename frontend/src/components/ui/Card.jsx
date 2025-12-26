import { cn } from "../../lib/utils";

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
  ...props // <-- THIS captures onClick and other props
}) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      {...props} // <-- THIS forwards onClick, style, id, etc
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        hover &&
          "transition-all duration-200 hover:shadow-lg hover:border-[#CA993B] cursor-pointer",
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

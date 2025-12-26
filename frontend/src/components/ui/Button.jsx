import { cn } from "../../lib/utils";

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
  disabled,
  ...props
}) {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-[#CA993B] hover:bg-[#B8872F] text-white shadow-md hover:shadow-lg disabled:bg-gray-300",
    secondary:
      "bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg disabled:bg-gray-300",
    outline:
      "border-2 border-[#CA993B] text-[#CA993B] hover:bg-[#CA993B] hover:text-white disabled:border-gray-300 disabled:text-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 disabled:text-gray-300",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-md disabled:bg-gray-300",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-6 py-3",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "cursor-not-allowed opacity-60",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
}

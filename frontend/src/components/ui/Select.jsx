import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Select = forwardRef(function Select(
  { label, error, options, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 border rounded-lg transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[#CA993B] focus:border-transparent",
          "appearance-none bg-white cursor-pointer",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 hover:border-gray-400",
          "disabled:bg-gray-100 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
});

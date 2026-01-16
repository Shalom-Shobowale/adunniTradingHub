import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showSideImage = false, // true for auth pages
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={
          showSideImage
            ? "absolute inset-0 bg-linear-to-b from-[#F2D9A3] via-[#CA993B] to-[#8F6A1E] bg-opacity-50"
            : "absolute inset-0 bg-white"
        }
        onClick={onClose}
      />

      {/* Modal wrapper */}
      <div
        className={`relative flex md:flex-row flex-col w-[90%] ${
          showSideImage ? "md:w-[80%]" : "w-[90%]"
        }`}
      >
        {/* SIDE IMAGE FOR AUTH ONLY */}
        {showSideImage && (
          <div
            className="hidden md:flex w-[60%] min-h-[70vh] rounded-l-2xl
          bg-[url(/good.png)] bg-no-repeat bg-center bg-cover
          justify-center items-center flex-col px-6"
          >
            <h1 className="text-white font-bold text-4xl text-center">
              Adunni Trading Hub
            </h1>
            <p className="text-white text-center font-medium mt-4 leading-relaxed">
              Quality Cowskin,
              <br />
              Made Easy from trusted suppliers straight to you.
              <br />
              Join Adunni Trading Hub today and enjoy stress-free ordering.
            </p>
          </div>
        )}

        {/* CONTENT */}
        <div
          className={`
            relative bg-white shadow-2xl
            overflow-y-auto max-h-[90vh]
            ${
              showSideImage
                ? "md:w-[40%] md:rounded-r-2xl"
                : "w-full rounded-2xl"
            }
            ${sizeClasses[size]}
          `}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

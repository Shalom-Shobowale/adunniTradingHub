import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({ isOpen, onClose, title, children, size = "md" }) {
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
      <div
        className="absolute inset-0 bg-linear-to-b from-[#F2D9A3] via-[#CA993B] to-[#8F6A1E] bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex md:flex-row flex-col w-[80%]">
        <div className=" hidden md:flex bg-red-700 w-[60%] min-h-[70vh] relative rounded-l-2xl bg-[url(/good.png)] bg-no-repeat bg-center bg-cover">
          <h1 className="text-white font-semibold">today is a good day</h1>
        </div>

        <div
          className={`relative bg-white md:rounded-2xl lg:rounded-l-none lg:rounded-r-2xl shadow-2xl md:w-[40%] ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        >
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

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

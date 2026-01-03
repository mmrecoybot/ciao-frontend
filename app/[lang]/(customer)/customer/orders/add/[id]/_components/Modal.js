import { X } from "lucide-react";
import Link from "next/link";

export function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-900 dark:text-gray-400 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 flex justify-between items-center border-b z-10">
          <h2 className="text-2xl font-bold uppercase">
            {title} Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

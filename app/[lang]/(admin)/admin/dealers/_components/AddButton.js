import Modal from "@/app/[lang]/components/Modal";
import React, { useState } from "react";

export default function UniversalAddButton({
  children,
  className = "bg-gradient-to-r from-emerald-200  to-teal-400 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 hover:dark:from-gray-800 hover:dark:via-slate-800 hover:dark:to-gray-700  dark:text-gray-400",
  buttonText = "Add New",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button className={`${className} p-1 px-4 rounded-full`} onClick={() => setIsOpen(true)}>
        {buttonText}
      </button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {/* {children} */}
          {isOpen &&
            React.cloneElement(children, {
              isOpen,
              setIsOpen,
            })}
        </Modal>
      )}
    </div>
  );
}

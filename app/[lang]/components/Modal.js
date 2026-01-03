"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Modal({ children, isOpen, onClose }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const onClick = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed z-50 h-screen w-screen top-0 left-0 bg-black/40 backdrop-blur-sm flex justify-center items-center"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="flex justify-center items-center h-full w-full overflow-y-scroll mx-auto my-auto"
      >
        <div className="backdrop-blur-xl shadow-md shadow-black/10 bg-white dark:bg-gray-800 p-3 rounded-xl">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
}

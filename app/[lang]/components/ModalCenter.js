"use client";

export default function ModalCenter({ children }) {
  return (
    <div className="fixed z-50 top-0 left-0 bg-black/40 backdrop-blur-sm mx-auto w-full h-full my-auto ">
      <div className="flex justify-center items-start  overflow-y-scroll mx-auto my-auto">
        <div className="backdrop-blur-xl shadow-md shadow-black/10 p-3 rounded-xl">
          <div className="bg-transparent">{children}</div>
        </div>
      </div>
    </div>
  );
}

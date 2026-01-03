"use client"

import { Fullscreen } from "lucide-react"
import { useState } from "react"
import DownloadPdf from "../(customer)/customer/components/DownloadPdf"
import { Download } from "lucide-react"
import Image from "next/image"

export default function ImmersiveImageModal({ url }) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const openModal = () => {
    setImageUrl(url)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <div className="p-3 absolute flex  flex-col items-center gap-2 bottom-1 left-1 text-white w-full text-xs bg-black/10 top-0 rounded-md h-full">
      <button
        onClick={() => openModal()}
        className="  flex items-center hover:bg-green-700/20 bg-black/10 gap-2 border  font-bold py-2 px-4 rounded justify-between backdrop-filter backdrop-blur-sm"
      >
       <Fullscreen className="w-6 h-6" /> Fullscreen
      </button>
      <DownloadPdf className="border font-bold py-2 px-4 hover:bg-green-700/20 rounded backdrop-filter backdrop-blur-sm bg-black/10" link={url} Icon={Download} title="Download" fileName={url?.split("/").pop()} />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div className="relative w-full h-full p-10 bg-black/50" onClick={(e) => e.stopPropagation()}>
            <Image src={imageUrl || "/placeholder.svg"} alt="Immersive View" className="w-full h-full object-contain" width={1000} height={1000} />
            <button onClick={closeModal} className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


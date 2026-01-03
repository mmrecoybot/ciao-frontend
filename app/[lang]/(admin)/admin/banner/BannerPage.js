
"use client"

import { useDeleteBannerMutation, useFetchBannersQuery } from "@/store/slices/bannerApi"
import { File, ImageDown, PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-toastify"
import BannerModal from "./_components/BannerModal"
import DeleteConfirmationModal from "./_components/DeleteModal"

const BannerPage = ({ dictionary }) => {
    const { data: banners, isLoading } = useFetchBannersQuery()
    const [deleteBanner] = useDeleteBannerMutation()

    const [openModal, setOpenModal] = useState(false)
    const [selectedBanner, setSelectedBanner] = useState(null)

    const [deletingBanner, setDeletingBanner] = useState(null)

    const editBannerModal = (banner) => {
        setSelectedBanner(banner)
        setOpenModal(true)
    }

    const addBannerModal = () => {
        setSelectedBanner(null)
        setOpenModal(true)
    }

    const handleDelete = async () => {
        if (deletingBanner) {
            try {
                await deleteBanner(deletingBanner.id)
                toast.success(`Banner "${deletingBanner.title}" deleted successfully!`)
            } catch (error) {
                toast.error(`Failed to delete banner "${deletingBanner.title}": ${error.message || "Unknown error"}`)
            } finally {
                setDeletingBanner(null)
            }
        }
    }

    return (
        <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center mb-6 bg-emerald-200 p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold text-gray-700 flex items-center gap-2"><ImageDown size={50} /> {dictionary.bannerPages.banner_gallery}</h1>
                <button
                    onClick={addBannerModal}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {dictionary.bannerPages.add_banner}
                </button>
            </div>

            {openModal && <BannerModal banner={selectedBanner} setOpenModal={setOpenModal} dictionary={dictionary} />}

            {deletingBanner && (
                <DeleteConfirmationModal
                    item={deletingBanner.title}
                    type="banner"
                    onClose={() => setDeletingBanner(null)}
                    onDelete={handleDelete}
                    dictionary={dictionary}
                />
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {banners?.map((banner) => (
                        <div
                            key={banner.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={banner.image || "/placeholder.svg"}
                                    alt={banner.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-opacity duration-300 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                                    <button
                                        onClick={() => editBannerModal(banner)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full mr-2 transition duration-300 ease-in-out"
                                        aria-label="Edit banner"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setDeletingBanner(banner)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition duration-300 ease-in-out"
                                        aria-label="Delete banner"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">{banner.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BannerPage


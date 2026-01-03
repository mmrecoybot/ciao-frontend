"use client";

import { useFetchBannersQuery } from "@/store/slices/bannerApi";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DownloadPdf from "../../components/DownloadPdf";
import Pagination from "./Pagination";
import SocialIcon from "./SocialIcon";
import Loading from "../../components/Loading";

const BANNERS_PER_PAGE = 4;

const Posters = () => {
  const { data: banners, isLoading } = useFetchBannersQuery();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return <div className="w-full h-screen flex justify-center items-center"><Loading /></div>;
  }

  if (!banners || banners.length === 0) {
    return <div className="text-center py-8">No banners available.</div>;
  }

  const totalPages = Math.ceil(banners.length / BANNERS_PER_PAGE);
  const startIndex = (currentPage - 1) * BANNERS_PER_PAGE;
  const endIndex = startIndex + BANNERS_PER_PAGE;
  const currentBanners = banners.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {currentBanners.map((banner, index) => (
            <div
              key={startIndex + index}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                width={500}
                height={400}
                src={banner?.image || "/placeholder.svg"}
                alt={`Banner ${startIndex + index + 1}`}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-4">
                  <SocialIcon Icon={Facebook} href="#" color="text-blue-600" />
                  <SocialIcon Icon={Twitter} href="#" color="text-sky-500" />
                  <SocialIcon Icon={Instagram} href="#" color="text-pink-600" />
                  <DownloadPdf link={banner?.image} color="text-pink-600" fileName={banner?.title} className="bg-white p-4"/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isDisabled={banners.length === 0}
        />
      </div>
    </div>
  );
};

export default Posters;

"use client";

import { useAddCartItemMutation } from "@/store/slices/cartApi";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiCartAdd } from "react-icons/bi";
import { toast } from "react-toastify";
import { Modal } from "../add/[id]/_components/Modal";
import SingleProduct from "../add/[id]/_components/SingleProduct";

const ProductCard = ({ product, showPrices, user, dictionary }) => {
  const [currentProductVariant, setCurrentProductVariant] = useState(
    product?.variations?.[0],
  );
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addCartItem, { isLoading, isSuccess, isError, error }] =
    useAddCartItemMutation();

  const handleColorClick = (id) => {
    const variant = product.variations.find((v) => v.id === id);
    if (variant) setCurrentProductVariant(variant);
  };

  const handleCart = () => {
    if (!user || !currentProductVariant) return;

    const cartItem = {
      productId: product.id,
      variationId: currentProductVariant.id,
      quantity: cartQuantity,
      userId: Number(user.sub),
    };

    addCartItem(cartItem);
  };

  useEffect(() => {
    if (isSuccess) toast.success("Product added to cart successfully!");
    if (isError)
      toast.error(error?.data?.error || "Error adding product to cart");
  }, [isSuccess, isError, error]);

  // 🔒 Bullet-proof image source
  const imageSrc =
    typeof currentProductVariant?.img === "string" &&
    currentProductVariant.img.trim() !== "" &&
    currentProductVariant.img !== "x" &&
    (currentProductVariant.img.startsWith("/") ||
      currentProductVariant.img.startsWith("http"))
      ? currentProductVariant.img
      : "/placeholder.png";

  return (
    <>
      <div className="bg-white flex flex-col justify-between dark:bg-gray-900 border dark:border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow relative">
        {product?.isNew && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-xs font-bold px-2 py-1 rounded -rotate-12">
            {dictionary.ordersPages.new}
          </div>
        )}

        <div>
          <Image
            onClick={() => setIsModalOpen(true)}
            src={imageSrc}
            alt={product?.name || "Product"}
            width={400}
            height={400}
            className="w-full ring-1 ring-gray-200 shadow-lg rounded-lg aspect-square object-contain mb-4 cursor-pointer"
          />

          <h3
            className="text-md font-semibold mb-2 text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsModalOpen(true)}
          >
            {product.name}
          </h3>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-2 mb-4">
            {showPrices === "no" ? (
              <span className="text-xl font-bold dark:text-gray-500">
                € {product.dealer_price}
              </span>
            ) : (
              <>
                <span className="text-xl font-bold dark:text-gray-500">
                  € {product.retail_price}
                </span>
                <span className="text-red-500 text-sm">
                  € {product.dealer_price}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {product?.variations?.map((variant) => (
                <div
                  key={variant.id}
                  className="w-6 h-6 rounded-md border cursor-pointer"
                  onClick={() => handleColorClick(variant.id)}
                  style={{ backgroundColor: variant.color?.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-evenly w-full">
            <div className="text-sm font-bold text-gray-500 w-1/3 text-center capitalize">
              {currentProductVariant?.color}
              <div className="text-green-500">
                {currentProductVariant?.stock}
              </div>
            </div>

            {/* ✅ Controlled input – warning free */}
            <input
              type="number"
              min={1}
              value={cartQuantity}
              onChange={(e) => setCartQuantity(Number(e.target.value))}
              className="w-1/3 border rounded px-2 py-1"
            />

            <button
              onClick={handleCart}
              disabled={isLoading}
              className="w-1/3 flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-1 text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <BiCartAdd size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="product"
      >
        <SingleProduct product={product} user={user} dictionary={dictionary} />
      </Modal>
    </>
  );
};

export default ProductCard;

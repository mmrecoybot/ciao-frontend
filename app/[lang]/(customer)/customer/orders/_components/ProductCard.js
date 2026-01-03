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
    product.variations[0]
  );
  const [cartQuantity, setCartQuantity] = useState(1);
  const [addCartItem, { isLoading, isSuccess, isError, error }] =
    useAddCartItemMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleColorClick = (id) => {
    const variant = product.variations.find((v) => v.id === id);
    setCurrentProductVariant(variant);
  };

  const handleCart = () => {
    const cartItem = {
      productId: product.id,
      variationId: currentProductVariant.id,
      quantity: parseInt(cartQuantity),
      userId: parseInt(user.sub),
    };
    addCartItem(cartItem);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product added to cart successfully!");
    } else if (isError) {
      toast.error(error?.data?.error || "Error adding product to cart");
    }
  }, [isSuccess, isError, error]);

  return (
    <>
      <div
        key={product.id}
        className="bg-white flex flex-col justify-between dark:bg-gray-900 border dark:border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20 rounded-lg p-4 hover:shadow-lg peer transition-shadow relative"
      >
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-xs font-bold px-2 py-1 rounded transform -rotate-12">
            {dictionary.ordersPages.new}
          </div>
        )}
        <div>

          <Image
            onClick={() => setIsModalOpen(true)}
            src={currentProductVariant?.img}
            alt={product.name}
            width={400}
            height={200}
            className="w-full ring-1 ring-gray-200 shadow-lg rounded-lg aspect-square object-contain mb-4"
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
              {product.variations.map((variant) => (
                <div
                  key={variant.color}
                  className="w-6 h-6 rounded-md border cursor-pointer"
                  onClick={() => handleColorClick(variant.id)}
                  style={{ backgroundColor: variant.color.toLowerCase() }}
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
            <input
              type="number"
              value={cartQuantity}
              min={1}
              defaultValue={1}
              className="w-1/3 border rounded px-2 py-1"
              onChange={(e) => {
                setCartQuantity(e.target.value);
              }}
            />
            <button
              onClick={handleCart}
              disabled={isLoading}
              className="w-1/3 flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-1 text-sm hover:bg-blue-600"
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

      {/* Modal with SingleProduct */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={'product'}>
        <SingleProduct product={product} user={user} dictionary={dictionary} />
      </Modal>
    </>
  );
};

export default ProductCard;

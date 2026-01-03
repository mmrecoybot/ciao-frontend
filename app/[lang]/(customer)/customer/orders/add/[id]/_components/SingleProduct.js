"use client";

import { useAddCartItemMutation } from "@/store/slices/cartApi";
import { Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCartAdd } from "react-icons/bi";
import { toast } from "react-toastify";

export default function SingleProduct({
  product,
  user,
  cartId,
  fromCart,
  cartVariation,
  dictionary,
}) {
  const [selectedColor, setSelectedColor] = useState(product?.variations[0]);
  const [quantity, setQuantity] = useState(1);
const params = useParams();
  const [addCartItem, { isLoading, isSuccess, isError, error }] =
    useAddCartItemMutation();

  const increaseQuantity = () => {
    if (quantity < selectedColor.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleCart = () => {
    const cartItem = {
      productId: product?.id,
      variationId: selectedColor?.id,
      quantity: parseInt(quantity),
      userId: parseInt(user?.sub),
    };

    addCartItem(cartItem)
      .unwrap()
      .then(() => {
        toast.success("Product added to cart successfully!");
      })
      .catch((apiError) => {
        toast.error(apiError?.data?.message || "Error adding product to cart");
      });
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Error adding product to cart");
    }
  }, [isError, error]);

  // if (product?.id !== cartId) return <div>No products</div>;

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Product Image */}
        <div className="lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-900">
          {/* Image Section */}
          <Image
            src={selectedColor?.img || cartVariation?.img}
            alt={`${product?.name} in ${selectedColor?.color || cartVariation?.color || "default"}`}
            width={500}
            height={500}
            className="w-full h-auto rounded-lg"
          />

          {/* Variations Section */}
          {!cartVariation ? (
            <div className="mt-6 flex justify-center gap-4">
              {product?.variations.map((variation) => (
                <button
                  key={variation?.id}
                  onClick={() => setSelectedColor(variation)}
                  className={`w-10 h-10 rounded-md border-2 transition-all duration-300 ${selectedColor?.id === variation?.id
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 hover:scale-105"
                    }`}
                  style={{ backgroundColor: variation?.color }}
                  aria-label={`Select ${variation?.color} color`}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold">
                {dictionary.ordersPages.selected_variation}: {cartVariation?.color}
              </p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            {product?.name}
          </h1>

          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">
            €{product?.retail_price}
            </span>
            <span className="ml-2 text-sm text-gray-500">{dictionary.productsPages.retail_price}</span>
          </div>

          <div className="mb-6 ">
            <p className="text-sm text-gray-600">
              {dictionary.productsPages.dealer_price}:{" "}
              <span className="font-semibold">€{product?.dealer_price}</span>
            </p>

            <p className="text-sm text-gray-600">
              {dictionary.ordersPages.margin}: <span className="font-semibold">{product?.margin}%</span>
            </p>
          </div>

          <div className="mb-6">
            <p className="font-semibold text-lg">
              {dictionary.orderPages.color}:{" "}
              <span className="capitalize text-blue-600">
                {selectedColor?.color || cartVariation?.color}
              </span>
            </p>
            <p className="font-semibold text-lg">
              {dictionary.productsPages.stock}:{" "}
              <span className="text-green-600">
                {selectedColor?.stock || cartVariation?.stock} units
              </span>
            </p>
          </div>

          {!fromCart && (
            <div className="mb-6 flex items-center">
              <span className="mr-4 text-lg font-semibold">{dictionary.orderPages.quantity}:</span>
              <button
                onClick={decreaseQuantity}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-l-md"
                disabled={quantity === 1}
              >
                <Minus size={20} />
              </button>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 text-lg font-semibold">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-r-md"
                disabled={quantity === selectedColor?.stock}
              >
                <Plus size={20} />
              </button>
            </div>
          )}

          {!fromCart && (
            <button
              onClick={handleCart}
              disabled={isLoading}
              className="w-full flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-1 text-xl hover:bg-blue-600"
            >
              {dictionary.ordersPages.add_to_cart}
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <BiCartAdd size={24} />
              )}
            </button>
          )}
        </div>
      </div>
      <div className="mt-12">
        <span className="text-lg font-semibold">{dictionary.ordersPages.product_description}</span>
        <p
          className="text-gray-600 mb-6 text-lg"
          dangerouslySetInnerHTML={{ __html: params?.lang === "it" ? product?.descriptionIt : product?.description }}
        />
      </div>
    </div>
  );
}

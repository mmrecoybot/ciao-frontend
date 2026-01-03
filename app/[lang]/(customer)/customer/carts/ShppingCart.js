"use client";
import { useEffect } from "react";

import SimpleImageUpload from "@/app/[lang]/(admin)/admin/products/new/components/SimpleImageUpload";
import {
  useClearCartMutation,
  useDeleteCartItemMutation,
  useFetchCartByUserQuery,
  useUpdateCartItemMutation,
} from "@/store/slices/cartApi";
import { useAddOrderMutation } from "@/store/slices/orderApi";
import { useFetchSingleProductsQuery } from "@/store/slices/productApi";
import {
  EyeIcon,
  Loader,
  MinusCircleIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiShoppingBag, BiTrash } from "react-icons/bi";

import { toast } from "react-toastify";
import Loading from "../components/Loading";
import NoDataFound from "../components/NoDataFound";
import { Modal } from "../orders/add/[id]/_components/Modal";
import SingleProduct from "../orders/add/[id]/_components/SingleProduct";

export default function ShppingCart({ dictionary, user, lang }) {
  const {
    data: carts,
    isLoading,
    isError,
  } = useFetchCartByUserQuery(user?.sub);

  const [cartId, setCartId] = useState(null);
  const [variation, setVariation] = useState(null);

  const { data: product } = useFetchSingleProductsQuery(cartId);
  const [
    updateCart,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorData,
    },
  ] = useUpdateCartItemMutation();
  const [
    removeCart,
    {
      isLoading: removeLoading,
      isSuccess: removeSuccess,
      isError: removeError,
      error: removeErrorData,
    },
  ] = useDeleteCartItemMutation();
  const [
    clearCart,
    {
      isLoading: clearLoading,
      isSuccess: clearSuccess,
      isError: clearError,
      error: clearErrorData,
    },
  ] = useClearCartMutation();
  const [
    addOrder,
    {
      isLoading: orderLoading,
      isSuccess: orderSuccess,
      isError: orderError,
      error: orderErrorData,
    },
  ] = useAddOrderMutation();

  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentProof, setPaymentProof] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shippingCost = 10;
  const subtotal = carts?.items?.reduce(
    (sum, item) =>
      sum + parseInt(item?.product?.dealer_price) * parseInt(item.quantity),
    0
  );
  const vatAmount = shippingCost * 0.22; // Assuming 22% VAT rate
  const total = subtotal + shippingCost + vatAmount;

  const handleAddItem = (cart) => {
    updateCart({
      id: parseInt(cart.id),
      quantity: parseInt(cart.quantity) + 1,
    });
  };

  const handleRemoveItem = (cart) => {
    updateCart({
      id: parseInt(cart.id),
      quantity: parseInt(cart.quantity) - 1,
    });
  };

  const handleDeleteItem = (id) => {
    removeCart(id);
  };

  const handleViewItem = (id, variation) => {
    setIsModalOpen(true);
    setCartId(id);
    setVariation(variation);
  };

  const handleProceed = () => {
    if (!paymentProof) {
      toast.error("Please upload your payment proof!");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select your payment method!");
      return;
    }
    if (!paymentDate) {
      toast.error("Please select your payment date!");
      return;
    }
    const orderData = {
      userId: parseInt(user.sub), //user.sub,
      products: carts.items,
      discount: 0,
      paymentProof: paymentProof,
      paymentDate: paymentDate.toISOString().split("T")[0],
      paymentMethod: paymentMethod,
      shippingCost: shippingCost,
      subtotal: subtotal,
      tax: vatAmount,
      total: total,
    };
    addOrder(orderData);
  };

  const handleClearCart = () => {
    clearCart(carts.id);
  };

  useEffect(() => {
    if (updateSuccess) {
      toast.dismiss();
      toast.success("Item updated successfully!");
    }
    if (updateError) {
      toast.dismiss();
      toast.error(updateErrorData?.data?.error);
    }
  }, [updateSuccess, updateError, updateErrorData]);

  useEffect(() => {
    if (removeSuccess) {
      toast.dismiss();
      toast.success("Item removed successfully!");
    }
    if (removeError) {
      toast.dismiss();
      toast.error(removeErrorData?.data?.error);
    }
  }, [removeSuccess, removeError, removeErrorData]);
  useEffect(() => {
    if (clearSuccess) {
      toast.dismiss();
      toast.success("Cart cleared successfully!");
      router.push(`/${lang}/customer/orders`);
    }
    if (clearError) {
      toast.dismiss();
      toast.error(clearErrorData?.data?.error);
    }
  }, [clearSuccess, clearError, clearErrorData]);

  useEffect(() => {
    if (orderSuccess) {
      toast.dismiss();
      toast.success("Order placed successfully!");
      clearCart(carts.id);
      ``;
      router.push(`/${lang}/customer/orders`);
    }
    if (orderError) {
      toast.dismiss();
      toast.error(orderErrorData?.data?.error);
    }
  }, [orderSuccess, orderError, orderErrorData, carts?.id]);

  if (isLoading) return <Loading />;
  if (carts?.items?.length === 0) return <NoDataFound title="Cart items" />;
  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">{dictionary.ordersPages.code}</th>
              <th className="p-2 text-left">{dictionary.activation.product}</th>
              <th className="p-2 text-left">{dictionary.orderPages.quantity}</th>
              <th className="p-2 text-right">{dictionary.orderPages.price}</th>
              <th className="p-2 text-right">{dictionary.cartsPage.discount}</th>
              <th className="p-2 text-right">{dictionary.orderPages.total}</th>
              <th className="p-2 text-right">{dictionary.cartsPage.vat}</th>
              <th className="p-2 text-right">{dictionary.cartsPage.total_vat_included}</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody className="dark:text-gray-400">
            {carts?.items?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item?.product?.product_code}</td>
                <td className="p-2">{item?.product?.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2 text-right">
                  {parseInt(item?.product?.dealer_price)?.toFixed(2)} €
                </td>
                <td className="p-2 text-right">{item?.product?.discount}%</td>
                <td className="p-2 text-right">
                  {(item?.product?.dealer_price * item.quantity)?.toFixed(2)} €
                </td>
                <td className="p-2 text-right">{item?.product?.vat || 0}%</td>
                <td className="p-2 text-right">
                  {(
                    parseInt(item?.product?.dealer_price) *
                    parseInt(item?.quantity)
                  ).toFixed(2)}{" "}
                  €
                </td>
                <td className="p-2 space-x-1">
                  <button
                    onClick={() => handleAddItem(item)}
                    className="p-1 text-green-600 hover:text-green-800"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="p-1 text-green-600 hover:text-green-800"
                  >
                    <MinusCircleIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      handleViewItem(item.productId, item?.variation)
                    }
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-between w-full gap-10">
        <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-400 p-4 rounded-lg w-1/2">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">{dictionary.orderPages.subtotal}:</span>
            <span>{subtotal?.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">{dictionary.orderPages.shipping_cost}:</span>
            <span>{shippingCost?.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">{dictionary.cartsPage.vat}:</span>
            <span>{vatAmount?.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span className="font-semibold">{dictionary.orderPages.total}:</span>
            <span>{total?.toFixed(2)} €</span>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-400 p-4 px-10 rounded-lg  w-full flex justify-between">
          <div className="space-y-2">
            <p className="mb-2 font-semibold">{dictionary.activationsPages.payment_method}</p>
            <label
              htmlFor="paymentMethod2"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                name="paymentMethod"
                id="paymentMethod2"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />{" "}
              {dictionary.cartsPage.cash}
            </label>
            <label
              htmlFor="paymentMethod3"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                name="paymentMethod"
                id="paymentMethod3"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
              />{" "}
              {dictionary.cartsPage.banking}
            </label>
            <label
              htmlFor="paymentMethod1"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                name="paymentMethod"
                id="paymentMethod1"
                value="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={() => setPaymentMethod("creditCard")}
              />{" "}
              {dictionary.cartsPage.credit_card}
            </label>


          </div>
          <div>
            <p className="mb-2 font-semibold">{dictionary.cartsPage.proof_of_payment}</p>
            <SimpleImageUpload
            dictionary={dictionary}
              onImageChange={(image) => setPaymentProof(image)}
              folder={`paymentProof/${paymentDate.toISOString().split("T")[0]}`}
            />
          </div>
          <div>
            <p className="mb-2 font-semibold">{dictionary.cartsPage.payment_date}</p>
            <input
              type="date"
              className="w-full rounded-lg border-gray-200 p-1.5 text-sm border dark:bg-gray-700 dark:text-gray-300"
              value={paymentDate.toISOString().split("T")[0]}
              onChange={(e) => setPaymentDate(new Date(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 space-x-4">
        <button
          onClick={handleProceed}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {orderLoading ? (
            <span className="flex items-center">
              <Loader className="animate-spin mr-2" /> {dictionary.orderPages.processing}...
            </span>
          ) : (
            <span className="flex items-center">
              <BiShoppingBag className="w-6 h-6 mr-2" />
              {dictionary.cartsPage.proceed_to_checkout}
            </span>
          )}
        </button>
        <button
          onClick={handleClearCart}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
        >
          {clearLoading ? (
            <span className="flex items-center">
              <Loader className="animate-spin mr-2" /> {dictionary.orderPages.processing}...
            </span>
          ) : (
            <span className="flex items-center">
              <BiTrash className="w-6 h-6 mr-2" />
              {dictionary.cartsPage.clear_cart}
            </span>
          )}
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SingleProduct
          cartId={cartId}
          user={user}
          product={product}
          fromCart={true}
          cartVariation={variation}
          dictionary={dictionary}
        />
      </Modal>
    </>
  );
}

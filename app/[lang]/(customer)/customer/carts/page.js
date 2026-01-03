import React from "react";
import ShoppingCart from "./ShppingCart";
import { auth } from "@/auth";
import { getDictionary } from "@/app/[lang]/dictionary";

const CartPage = async ({ params: { lang } }) => {
  const session = await auth();
  const dictionary = await getDictionary(lang);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        <span className="text-gray-600">{dictionary.cartsPage.shopping_cart}</span>
      </h1>
      <ShoppingCart dictionary={dictionary} user={session.user} lang={lang} />
    </div>
  );
};

export default CartPage;

import React from "react";

export default function BillingAddress({ dealerData, dictionary }) {
  if (!dealerData.billingAddress) return null;
  return (
    <div>
      <p>
        {dealerData.billingAddress?.street} {dealerData.billingAddress?.number}
      </p>
      <p>
        {dealerData.billingAddress?.zipCode}{" "}
        {dealerData.billingAddress?.municipality},{" "}
        {dealerData.billingAddress?.province}
      </p>
      <p>{dealerData.billingAddress?.country}</p>
    </div>
  );
}

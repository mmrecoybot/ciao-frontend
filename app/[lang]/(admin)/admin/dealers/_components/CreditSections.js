import React from "react";

export default function CreditSections({ dealerData }) {
    if(!dealerData.creditDetails?.assignedCreditLimit) return <p>No credit limit assigned</p>
  return (
    <div className="grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-200">
      <p>
        <span className="font-semibold">Assigned Credit Limit:</span> €
        {dealerData.creditDetails.assignedCreditLimit.toLocaleString()}
      </p>
      <p>
        <span className="font-semibold">Invoices to Pay:</span> €
        {dealerData.creditDetails.invoicesToPay.toLocaleString()}
      </p>
      <p>
        <span className="font-semibold">Available Credit Limit:</span> €
        {dealerData.creditDetails.availableCreditLimit.toLocaleString()}
      </p>
      <p>
        <span className="font-semibold">Escudo:</span> €
        {dealerData.creditDetails.escudo.toLocaleString()}
      </p>
      <p>
        <span className="font-semibold">Credit for Top-Ups:</span> €
        {dealerData.creditDetails.creditForTopUps.toLocaleString()}
      </p>
    </div>
  );
}


export default function GeneralInformation({ dealerData, dictionary }) {
  return (
    <div className="grid grid-cols-2 gap-4 ">
      <p>
        <span className="font-semibold">{dictionary.dealerPages.dealerCode}: </span>{dealerData.dealerCode}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.vatNumber}: </span>{dealerData.vatNumber}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.taxCode}: </span>{dealerData.taxCode}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.adminPhone}: </span>{dealerData.adminPhone}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.pecEmail}: </span>{dealerData.pecEmail}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.adminEmail}: </span>{dealerData.adminEmail}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.iban}: </span>{dealerData.iban}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.paymentMethod}: </span>{dealerData.paymentMethod}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.accountNumber}: </span>{dealerData.accountNumber}
      </p>
      <p>
        <span className="font-semibold">{dictionary.dealerPages.recoveryEmail}: </span>{dealerData.recoveryEmail}
      </p>
      {dealerData.websiteUrl && (
        <>
          <p>
            <span className="font-semibold">{dictionary.dealerPages.website}: </span>
            <a
              href={dealerData.websiteUrl}
              className="text-blue-400 hover:underline"
            >
              {dealerData.websiteUrl}
            </a>
          </p>
        </>
      )}
    </div>
  );
}

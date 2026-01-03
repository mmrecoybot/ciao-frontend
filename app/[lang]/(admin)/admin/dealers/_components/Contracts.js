import ImmersiveImageModal from '@/app/[lang]/components/ImmersiveImageModal'
import Image from 'next/image'

export default function Contracts({ dealerData, dictionary }) {
  if (dealerData.signedContracts.length === 0) {
    return <p>{dictionary.dealersPage.no_contracts_signed}</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dealerData.signedContracts.map((contract, index) => (
        <div
          key={index}
          className="p-4 dark:bg-gray-800 rounded-lg dark:text-gray-200 shadow shadow-blue-300"
        >
          <h3 className="font-semibold text-lg mb-2">{contract.name}</h3>
          <p>
            {dictionary.dealersPage.signed_on}: {new Date(contract.signedOn).toLocaleDateString()}
          </p>
          <div className='relative'>
            <Image
              src={contract.fileUrl}
              alt={contract.name}
              width={200}
              height={200}
              className="w-full h-32 object-cover rounded-lg shadow-sm"
            />
            <ImmersiveImageModal url={contract.fileUrl} />
          </div>
        </div>
      ))}
    </div>
  )
}

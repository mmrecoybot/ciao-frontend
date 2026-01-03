import React from 'react'
import { PlusCircleIcon, MinusCircleIcon, XCircleIcon } from 'lucide-react'
import { EyeIcon } from 'lucide-react'

export default function ActionButtons({ item, lang, handleAddItem, handleRemoveItem, handleDeleteItem, handleViewItem }) {
  return (
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
                onClick={() => handleViewItem(item.id)}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </td>
  )
}

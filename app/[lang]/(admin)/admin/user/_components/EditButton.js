import { useState } from "react";

import { BiPencil } from "react-icons/bi";
import RelativeModal from "../../components/RelativeModal";
import UserFrom from "./UserFrom";

export default function EditButton({ user, dictionary, lang }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" text-start">
      <button
        onClick={toggleModal}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {/* <BiPencil size={20} /> */}
        {dictionary.personalDataPage.edit}
      </button>
      {isOpen && (
        <RelativeModal
          setShowForm={toggleModal}
          title={dictionary.personalDataPage.edit}
        >
          <UserFrom
            setShowForm={toggleModal}
            isEdit={true}
            user={user}
            dictionary={dictionary}
            lang={lang}
            userToEdit={user}
          />
        </RelativeModal>
      )}
    </div>
  );
}

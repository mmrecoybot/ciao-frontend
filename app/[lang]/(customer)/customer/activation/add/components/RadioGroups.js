import { Loader } from "lucide-react";
import React from "react";

export default function RadioGroups({
  section,
  selectedOptions,
  handleOptionChange,
}) {

  return (
    <div>
      <p className="text-sm font-semibold text-[#3c8dde] uppercase">
        {section?.category}
      </p>
      <div className="flex text-sm gap-8 items-center text-gray-500 justify-center border mx-auto  py-2 rounded-md mt-2">
        {section?.options.length === 0?<div className=" h-14 w-14 rounded-full flex items-center justify-center"><Loader className="animate-spin" /></div>:section?.options.map((option, index) => (
          <div key={index}>
            <label
              htmlFor={option.value}
              className={`cursor-pointer flex flex-col items-center ${
                selectedOptions[section.category] === option.value || selectedOptions[section.category] === option.id
                  ? "text-[#61b22efb] font-semibold"
                  : ""
              }`}
              onClick={() => handleOptionChange(section.category, option.value, option)}
            >
              <p className="capitalize">{option?.icon}</p>
              <span>{option?.label}</span>
            </label>
            <input
              type="radio"
              id={option.value}
              name={section.category}
              value={option.value}
              checked={selectedOptions[section.category] === option.value}
              onChange={() =>
                handleOptionChange(section.category, option.value, option)
              }
              className="hidden"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

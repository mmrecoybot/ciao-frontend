import { ChevronDownIcon } from "lucide-react";
import { ChevronUpIcon } from "lucide-react";
import React from "react";
import UniversalAddButton from "./AddButton";

export default function SectionCard({
  title,
  children,
  sectionKey,
  toggleSection,
  expandedSections,
  layer = 0,
  addButton,
  buttonText,
}) {
  return (
    <div
      className={`mb-6 overflow-hidden rounded-lg ${getLayerStyle(
        layer
      )} shadow`}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer dark:text-gray-300"
        onClick={() => toggleSection(sectionKey)}
      >
        <h2 className=" font-semibold text-gray-800 dark:text-gray-300">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {addButton && (
            <UniversalAddButton buttonText={buttonText}>
              {addButton}
            </UniversalAddButton>
          )}
          {expandedSections[sectionKey] ? (
            <ChevronUpIcon className="w-6 h-6 text-gray-400 dark:text-gray-300" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-gray-400 dark:text-gray-300" />
          )}
        </div>
      </div>
      {expandedSections[sectionKey] && (
        <div className="px-6 py-4 bg-emerald-50 dark:bg-gray-800 text-gray-800 dark:text-gray-400 h-full text-base">
          {children}
        </div>
      )}
    </div>
  );
}


const getLayerStyle = (layer) => {
  switch (layer) {
    case 1:
      return "bg-gradient-to-r from-gray-100 to-violet-200 dark:from-slate-900 dark:to-gray-800"; // Light and clean with subtle depth
    case 2:
      return "bg-gradient-to-r from-blue-50 to-sky-200 dark:from-slate-800 dark:to-slate-900"; // Calm, professional blue tones
    case 3:
      return "bg-gradient-to-r from-indigo-200 to-violet-300 dark:from-navy-900 dark:to-cyan-800"; // Soft but vibrant and fresh
    default:
      return "bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-200 dark:from-gray-900 dark:via-slate-800 dark:to-gray-950"; // Fresh, minimal, and corporate
  }
};

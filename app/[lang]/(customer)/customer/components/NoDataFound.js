import { MailWarning } from "lucide-react";
import { LucideFileWarning } from "lucide-react";
import { FileWarning } from "lucide-react";
import { CgTrashEmpty } from "react-icons/cg";
import { FaWineGlassEmpty } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";

export default function NoDataFound({ title }) {
  return (
    <div className="p-6 space-y-6   w-full">
      <div className="flex flex-col items-center justify-center">
        <span className="mt-4 flex items-center text-2xl font-semibold text-gray-500">
          <IoWarning className="text-red-500" size={96} />
          No {title} found !
        </span>
      </div>
    </div>
  );
}

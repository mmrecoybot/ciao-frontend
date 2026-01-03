import { Power } from "lucide-react";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenu5Line } from "react-icons/ri";
import { logout } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function Header({
  lang,
  dictionary,
  setIsCollapsed,
  isCollapsed,
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout()
      .then(() => {
        router.refresh();
      })
      .finally(() => {
        router.push(`/${lang}/admin-login`);
      });
  };

  return (
    <div className="bg-emerald-100 dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center z-50  ">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-gray-500 dark:text-gray-200"
      >
        {!isCollapsed ? (
          <CgMenuMotion className="w-6 h-6" />
        ) : (
          <RiMenu5Line className="w-6 h-6" />
        )}
      </button>
      <div className="flex items-center gap-8 sm:pr-20">
        {session?.user && (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <User className="size-6 text-gray-500 dark:text-gray-200" />
              <span className="text-gray-500 dark:text-gray-200">
                {session?.user?.name}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="   text-blue-700 dark:text-blue-400  rounded-md transition duration-200 flex items-center hover:text-blue-600"
            >
              <Power className="w-4 h-4" />
              <span className="ml-1">
                {dictionary.customerComponents.logout}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

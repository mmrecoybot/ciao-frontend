"use client";

import LanguageSwitcher from "@/app/[lang]/components/LanguageSwitcher";
import { logout } from "@/app/actions";
import { useFetchCartByUserQuery } from "@/store/slices/cartApi";
import { useFetchSingleDealerQuery } from "@/store/slices/dealerApi";
import { useFetchUserNotificationsQuery } from "@/store/slices/notificationApi";
import NumberFlow from "@number-flow/react";
import {
  ChevronDown,
  List,
  ListCheckIcon,
  Lock,
  Plus,
  Power,
  ShoppingCart,
  UserCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Kaushan_Script } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaBagShopping, FaDashcube, FaShopify } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import DarkMood from "./ui/DarkMood";
import Link from "next/link";
import { User } from "lucide-react";
import { Building2 } from "lucide-react";
import { useFetchPermissionByUserIdQuery } from "@/store/slices/permissionApi";
import Loading from "./Loading";
const festive = Kaushan_Script({ subsets: ["latin"], weight: "400" });

export default function NavSideBar({ params, dictionary, isDrawerOpen }) {
  const { lang } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { data: notifications } = useFetchUserNotificationsQuery(
    session?.user?.sub,
    { skip: !session?.user?.sub },
  );
  const { data: carts = [] } = useFetchCartByUserQuery(session?.user?.sub, {
    skip: !session?.user?.sub,
  });
  const { data: dealer } = useFetchSingleDealerQuery(session?.user?.dealerId, {
    skip: !session?.user?.dealerId,
  });
  const { data: userPermissions, isLoading } = useFetchPermissionByUserIdQuery(
    session?.user?.sub,
    { skip: !session?.user?.sub },
  );

  const navItems = [
    {
      href: `/${lang}/customer/notification`,
      icon: <FaDashcube className="w-6 h-6" />,
      label: dictionary.notification,
    },
    {
      href: `/${lang}/customer/activation`,
      icon: <IoCall className="w-6 h-6" />,
      label: dictionary.activations,
      requiredPermission: "view_activations", // Permission needed for Activations link
      subMenu: [
        {
          href: `/${lang}/customer/activation/add`,
          icon: <Plus className="w-6 h-6" />,
          label: dictionary.add_activation,
          requiredPermission: "manage_activations", // Permission needed for Add Activation link
        },
        {
          href: `/${lang}/customer/activation`,
          icon: <List className="w-6 h-6" />,
          label: dictionary.activation_list,
          requiredPermission: "view_activations", // Permission needed for Activation List link
        },
      ],
    },
    {
      href: `/${lang}/customer/orders`,
      icon: <FaShopify className="w-6 h-6" />,
      label: dictionary.orders,
      requiredPermission: "view_all_orders", // Permission needed for Orders link
      subMenu: [
        {
          href: `/${lang}/customer/orders/add?category=smartphone&showPrices=no&sort=default`,
          icon: <ShoppingCart className="w-6 h-6" />,
          label: dictionary.add_order,
          requiredPermission: "manage_orders", // Permission needed for Add Order link
        },
        {
          href: `/${lang}/customer/orders`,
          icon: <ListCheckIcon className="w-6 h-6" />,
          label: dictionary.order_list,
          requiredPermission: "view_all_orders", // Permission needed for Order List link
        },
        {
          href: `/${lang}/customer/carts`,
          icon: <FaBagShopping className="w-6 h-6" />,
          label: dictionary.cart_list,
          requiredPermission: "view_carts", // Permission needed for Cart List link
        },
      ],
    },
    {
      href: `/${lang}/customer/personal-data`,
      icon: <UserCheck className="w-6 h-6" />,
      label: dictionary.personal_data,
      requiredPermission: "view_dealers", // Permission needed for Personal Data link
    },
  ];

  const handleSignOut = async () => {
    const res = await logout();
    if (res.success) {
      router.refresh();
      router.push("/login");
    }
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  // Helper function to check if the user has a specific permission
  const userHasPermission = (permissionName) => {
    // If user or their role/permissions are not loaded or missing, they don't have permission
    if (!userPermissions || userPermissions.length === 0) {
      return false;
    }

    // console.log(userPermissions);

    // Check if the permissionName exists in the user's permissions array (case-sensitive match)
    return userPermissions.some(
      (permission) => permission.name === permissionName,
    );
  };

  // Filter the navItems based on user permissions
  const filteredNavItems = navItems
    .map((item) => {
      // Handle top-level items with href (like customer site link)
      if (item.href) {
        // Only keep if no required permission OR user has the permission
        if (
          !item.requiredPermission ||
          userHasPermission(item.requiredPermission)
        ) {
          if (item.subMenu) {
            const visibleSubItems = item.subMenu.filter(
              (subItem) =>
                !subItem.requiredPermission ||
                userHasPermission(subItem.requiredPermission),
            );
            if (visibleSubItems.length > 0) {
              return { ...item, subMenu: visibleSubItems };
            }
          }
          return item;
        }
        return null; // Hide item if permission required and not met
      }

      // Hide items that don't match expected structure (single link or tagged menu)
      return null;
    })
    .filter((item) => item !== null); // Remove null items

  // console.log(userPermissions);

  return (
    <div
      className="bg-black-500/40 fixed lg:static top-0 left-0 right-0 bottom-0 z-40"
      // style={{ transition: "all 0.3s ease-in-out", transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",  }}
    >
      {/* Sidebar */}
      <div
        className={`bg-emerald-200 dark:bg-gray-900 relative text-slate-600 xl:w-64 w-48 min-w-[4rem] flex flex-col duration-300 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative h-screen z-40`}
      >
        <div className="flex items-center h-20 justify-center cursor-pointer overflow-hidden">
          <h1
            className={`text-slate-600 dark:text-slate-400 text-xl xl:text-3xl font-thin ${festive.className}`}
          >
            <Link href={`/${params.lang}/customer`}>
              📱 <span className="delay-700">Ciao Mobile</span>
            </Link>
          </h1>
        </div>
        <div className="flex justify-center gap-4 items-center p-2 h-20  w-full">
          {/* <DarkMood  /> */}
          <LanguageSwitcher dictionary={dictionary} />
        </div>
        {!isLoading ? (
          <nav className="max-h-[calc(100vh-6rem)] overflow-y-auto flex-1 flex flex-col mt-5">
            {filteredNavItems.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div
                  onClick={() =>
                    item.subMenu ? toggleSubmenu(index) : router.push(item.href)
                  }
                  className={`flex items-center py-3 px-4 cursor-pointer transition duration-200 dark:text-gray-500 ${
                    pathname.includes(item.href)
                      ? "bg-gray-800 dark:bg-gray-950 text-gray-200 dark:text-gray-300"
                      : "hover:bg-gray-800 dark:hover:bg-gray-950 hover:text-gray-200 dark:hover:text-gray-300"
                  }`}
                >
                  <div
                    className={`flex items-center 
                    justify-between w-full
                  }`}
                  >
                    <div className="flex items-center w-full">
                      {item.icon}
                      <span className="ml-4">{item.label}</span>
                      {item.label === dictionary.notification && (
                        <span className="justify-self-end ml-4 bg-green-200 font-bold text-red-700 rounded-full w-6 h-6 flex items-center justify-center">
                          <NumberFlow
                            value={
                              notifications?.filter((n) => !n.seen)?.length || 0
                            }
                            format={{ notation: "compact" }}
                            locales="en-US"
                          />
                        </span>
                      )}
                    </div>
                    {item.subMenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openSubmenu === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </div>

                {item.subMenu && openSubmenu === index && (
                  <div className="bg-gray-800/10 dark:bg-gray-950/50 overflow-hidden">
                    {item.subMenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={`flex items-center py-2 px-8 hover:bg-emerald-300 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          pathname === subItem.href &&
                          " text-blue-700 dark:text-emerald-400"
                        }`}
                      >
                        {subItem.icon}
                        <span className="ml-4">{subItem.label}</span>
                        {subItem.label === dictionary.cart_list &&
                          carts?.items?.length > 0 && (
                            <span className="justify-self-end ml-4 bg-green-200 font-bold text-red-700 rounded-full w-6 h-6 flex items-center justify-center">
                              <NumberFlow
                                value={carts?.items?.length || 0}
                                format={{ notation: "compact" }}
                                locales="en-US"
                              />
                            </span>
                          )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        )}

        {session?.user && (
          <div className="flex items-start flex-col gap-1 text-sm font-medium px-4 py-2 capitalize">
            <span className="text-gray-800 flex items-center gap-1">
              <User className="size-4 text-blue-700 dark:text-gray-400" />{" "}
              {session?.user?.name}
            </span>
            <span className="text-gray-800 flex items-center gap-1">
              <Building2 className="size-4 text-blue-700 dark:text-gray-400" />
              {dealer?.companyName}
            </span>

            <div className="flex items-center gap-2 justify-between my-4">
              <Link
                href="/customer/change-password"
                className="text-blue-700 dark:text-gray-400 rounded-md transition duration-200 flex items-center"
              >
                <Lock className="w-4 h-4" />
                <span className="ml-1">{dictionary.change_password}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="dark:text-gray-400 text-blue-700 rounded-md transition duration-200 flex items-center"
              >
                <Power className="w-4 h-4" />
                <span className="ml-1">{dictionary.Logout}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

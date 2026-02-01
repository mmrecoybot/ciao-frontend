"use client";

import {
  BadgeEuro,
  Building2,
  ChevronDown,
  Dot,
  FileImage,
  House,
  Paperclip,
  ShoppingCart,
  Smartphone,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Kaushan_Script } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineApple } from "react-icons/ai";
import { FaShopify } from "react-icons/fa6";
import DarkMood from "../../../(customer)/customer/components/ui/DarkMood";

import LanguageSwitcher from "@/app/[lang]/components/LanguageSwitcher";

import { BadgeCheck, FileText, Handshake, Phone } from "lucide-react";
import { Bell } from "lucide-react";
import { Mails } from "lucide-react";
import { Lock } from "lucide-react";
import { useFetchPermissionByUserIdQuery } from "@/store/slices/permissionApi";
import Loading from "./Loading";
const festive = Kaushan_Script({ subsets: ["latin"], weight: "400" });

export default function NavSideBar({
  dictionary,
  setIsCollapsed,
  isCollapsed,
  isSmall,
  params: { lang },
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Define your navigation items with required permissions
  const navItems = [
    {
      href: `/${lang}/customer`, // Link to customer site (might not need admin permission)
      icon: <House className="w-5 h-5" />,
      label: dictionary.customer_Site,
      // requiredPermission: 'view_customer_site', // Example permission if needed
    },
    {
      tag: dictionary.order_management,
      menu: [
        {
          href: `/${lang}/admin/orders`, //not showing
          icon: <ShoppingCart className="w-5 h-5" />,
          label: dictionary.orders,
          requiredPermission: "view_all_orders", // Permission needed to see Orders link
        },
      ],
    },
    {
      tag: dictionary.product_management,
      menu: [
        {
          href: `/${lang}/admin/brands`,
          icon: <AiOutlineApple className="w-5 h-5" />,
          label: dictionary.brands,
          requiredPermission: "view_brands", // Permission needed for Brands link
        },
        {
          // This is a submenu toggle, the permission might apply to subitems
          icon: <FaShopify className="w-5 h-5" />,
          label: dictionary.category,
          // requiredPermission: 'view_categories', // Add permission if seeing the category toggle requires it

          subMenu: [
            {
              href: `/${lang}/admin/category`,
              icon: <Dot className="w-5 h-5" />,
              label: dictionary.category,
              requiredPermission: "view_categories", // Or 'view_categories'
            },
            {
              href: `/${lang}/admin/category/sub-category`,
              icon: <Dot className="w-5 h-5" />,
              label: dictionary.sub_category,
              requiredPermission: "view_categories", // Or 'view_subcategories'
            },
          ],
        },
        {
          href: `/${lang}/admin/products`,
          icon: <Smartphone className="w-5 h-5" />,
          label: dictionary.products,
          requiredPermission: "view_products", // Permission needed for Products link
        },
      ],
    },
    {
      tag: dictionary.activation_management,
      menu: [
        {
          href: `/${lang}/admin/company`,
          icon: <Building2 className="w-5 h-5" />,
          label: dictionary.company,
          requiredPermission: "view_companies", // Permission needed for Companies link
        },
        {
          href: `/${lang}/admin/sims`, // Assuming this is a link to SIM Serial numbers or similar
          icon: <Phone className="w-5 h-5" />,
          label: dictionary.sim,
          requiredPermission: "view_sim_serials", // Permission needed for SIMs link
        },
        {
          href: `/${lang}/admin/tariff`,
          icon: <BadgeEuro className="w-5 h-5" />,
          label: dictionary.tariff,
          requiredPermission: "view_tariffs", // Permission needed for Tariffs link
        },
        {
          href: `/${lang}/admin/activation`,
          icon: <Paperclip className="w-5 h-5" />,
          label: dictionary.activation,
          requiredPermission: "view_activations", // Permission needed for Activations link
        },
      ],
    },
    {
      tag: dictionary.marketing_section,
      menu: [
        {
          href: `/${lang}/admin/banner`,
          icon: <FileImage className="w-5 h-5" />,
          label: dictionary.banners,
          requiredPermission: "view_banners", // Permission needed for Banners link (assuming part of shop management)
          // requiredPermission: 'view_banners', // Or a more specific permission
        },
      ],
    },
    {
      tag: dictionary.administration,
      menu: [
        {
          href: `/${lang}/admin/user`, // Assuming this is the general user management page
          icon: <Users className="w-5 h-5" />,
          label: dictionary.users,
          requiredPermission: "view_users", // Permission needed for Users link
        },
        {
          href: `/${lang}/admin/dealers`,
          icon: <Handshake className="w-5 h-5" />,
          label: dictionary.dealers,
          requiredPermission: "view_dealers", // Permission needed for Dealers link (scoped in controller)
        },
        {
          href: `/${lang}/admin/roles`,
          icon: <BadgeCheck className="w-5 h-5" />,
          label: dictionary.roles,
          requiredPermission: "manage_roles", // Permission needed for Roles link
        },
        {
          href: `/${lang}/admin/permissions`,
          icon: <BadgeCheck className="w-5 h-5" />,
          label: dictionary.permissions,
          requiredPermission: "manage_permissions", // Permission needed for Permissions link
        },
        {
          href: `/${lang}/admin/mail`, // Assuming this is a Send Mail page
          icon: <Mails className="w-5 h-5" />,
          label: "Send Mail", // Assuming 'Send Mail' is not in dictionary
          requiredPermission: "manage_roles", // Permission needed for Send Mail link
        },
        {
          href: `/${lang}/admin/notification`, // Assuming this is Send Notification page
          icon: <Bell className="w-5 h-5" />,
          label: dictionary.send_notification, // Assuming this is 'manage_notifications'
          requiredPermission: "manage_notifications", // Permission needed for Send Notification link
        },
        {
          href: `/${lang}/admin/logs`, // Assuming this is a Logs page (workflows/activity logs)
          icon: <FileText className="w-5 h-5" />,
          label: "Logs", // Assuming 'Logs' is not in dictionary
          requiredPermission: "view_workflows", // Or 'view_logs', 'manage_workflows'
        },
        {
          href: `/${lang}/admin/change-password`, // Assuming this is a user self-service page
          icon: <Lock className="w-5 h-5" />,
          label: dictionary.change_password,
          // This might not need a specific permission check beyond being authenticated,
          // as changing *own* password is a basic user right.
          // requiredPermission: 'change_own_password', // Example if needed
        },
      ],
    },
  ];

  // Get the user from the session
  const user = session?.user;
  const { data: userPermissions, isLoading } = useFetchPermissionByUserIdQuery(
    user?.sub,
    { skip: !user?.sub },
  );

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
          return item;
        }
        return null; // Hide item if permission required and not met
      }

      // Handle tagged menu sections
      if (item.tag && item.menu) {
        // Filter the menu items within this section
        const visibleMenuItems = item.menu
          .map((menu) => {
            // Filter sub-menu items if they exist
            if (menu.subMenu) {
              const visibleSubItems = menu.subMenu.filter((subItem) => {
                return (
                  !subItem.requiredPermission ||
                  userHasPermission(subItem.requiredPermission)
                );
              });
              // Return the menu item with only its visible sub-menu items
              return { ...menu, subMenu: visibleSubItems };
            }
            // Return the menu item as is if no submenu
            return menu;
          })
          .filter(
            (menu) =>
              // Keep the menu item if it has a direct link (and permission if required) OR if its filtered submenu has items
              (!menu.requiredPermission ||
                userHasPermission(menu.requiredPermission)) && // User must have permission for the menu item itself
              (menu.href || (menu.subMenu && menu.subMenu.length > 0)), // Item must have a link OR visible sub-items
          );

        // If there are any visible menu items in this section, keep the section (tag)
        if (visibleMenuItems.length > 0) {
          return { ...item, menu: visibleMenuItems };
        }
        return null; // Hide the whole section if no items are visible
      }

      // Hide items that don't match expected structure (single link or tagged menu)
      return null;
    })
    .filter((item) => item !== null); // Remove null items

  const toggleSubmenu = (index, menu) => {
    // Only navigate if the menu item itself has a href
    if (menu?.href !== undefined) {
      router.push(menu.href);
    }
    // Always toggle submenu if it exists, regardless of direct link
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <div
      className={`bg-emerald-200 dark:bg-gray-900 group relative text-slate-600  shadow-lg shadow-slate-400  ${
        isCollapsed ? "xl:w-20 w-16" : "xl:w-64 w-48"
      } min-w-[4rem] flex flex-col duration-300`}
      onClick={() => isSmall && setIsCollapsed(true)}
    >
      <div className="flex items-center h-20 justify-center cursor-pointer overflow-hidden group-hover:overflow-visible">
        <h1
          className={`text-black dark:text-slate-400 text-4xl font-thin ${festive.className}`}
        >
          <Link href={`/${params.lang}/admin`}>
            📱 {!isCollapsed && <span className="delay-700">Ciao Mobile</span>}
          </Link>
        </h1>
      </div>

      <div
        className={` ${
          isCollapsed ? "flex-col" : "flex-row"
        } flex items-center justify-center gap-4 px-4 py-2`}
      >
        {/* <DarkMood isCollapsed={isCollapsed} /> */}
        <LanguageSwitcher isCollapsed={isCollapsed} dictionary={dictionary} />
      </div>

      {/* Render Filtered Navigation Items */}
      {!isLoading ? (
        <nav className="max-h-[calc(100vh-6rem)] overflow-y-auto flex-1 flex flex-col">
          {filteredNavItems.map((item, index) => (
            <div key={index} className="flex flex-col">
              {/* Render Tag if it exists */}
              {item?.tag && !isCollapsed && (
                <p className="hidden md:block text-[12px] font-semibold px-2 py-2 text-gray-500">
                  {item?.tag}
                </p>
              )}
              {item?.tag && isCollapsed && (
                <p className=" font-bold px-5 py-1 text-gray-500">...</p>
              )}

              {/* Handle items with 'menu' (tagged sections) */}
              {item?.menu ? (
                item.menu.map((menu, indx) => (
                  <div key={indx} className="flex flex-col">
                    {/* Render Menu Item (Link or Submenu Toggle) */}
                    <div
                      // No longer using href directly on the div, handle navigation in onClick
                      onClick={() => toggleSubmenu(`${item.tag}-${indx}`, menu)} // Use tag + index for unique key
                      onMouseEnter={() =>
                        setHoveredIndex(`${item.tag}-${indx}`)
                      }
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={` flex items-center py-3 px-4 cursor-pointer transition duration-200 dark:text-gray-500
                    ${
                      // Check if pathname includes this item's href or any of its subitem hrefs
                      pathname.includes(menu.href) ||
                      (menu.subMenu &&
                        menu.subMenu.some((sub) => pathname.includes(sub.href)))
                        ? "bg-gray-800 text-gray-200"
                        : "hover:bg-gray-800 hover:text-gray-200"
                    }`}
                    >
                      {menu.icon}
                      {!isCollapsed && (
                        <span className="ml-3 font-sans text-sm font-bold">
                          {menu.label}
                        </span>
                      )}
                      {/* Only show chevron if there are visible submenu items */}
                      {menu.subMenu && menu.subMenu.length > 0 && (
                        <ChevronDown
                          className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                            openSubmenu === `${item.tag}-${indx}`
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      )}
                      {/* Collapsed label on hover */}
                      {isCollapsed &&
                        hoveredIndex === `${item.tag}-${indx}` && (
                          <span
                            className={`font-sans text-sm p-3 font-bold absolute left-full top-1/2 -translate-y-1/2 ml-2 z-10 w-max bg-gray-800 text-gray-200 delay-200 transition-all duration-200 whitespace-nowrap`}
                            style={{ left: "calc(100% + 0.5rem)" }} // Position to the right
                          >
                            {menu.label}
                          </span>
                        )}
                    </div>

                    {/* Submenu Display Logic - Only display if has visible subItems and is open */}
                    {menu.subMenu &&
                      menu.subMenu.length > 0 &&
                      openSubmenu === `${item.tag}-${indx}` &&
                      !isCollapsed && (
                        <div className="bg-emerald-200 dark:bg-gray-800">
                          {/* Submenu items are already filtered */}
                          {menu.subMenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className={`flex items-center py-2 px-8 hover:bg-emerald-300 dark:hover:bg-gray-700 transition-colors duration-200
                            ${
                              pathname.includes(subItem.href)
                                ? "bg-gray-700 text-lime-100"
                                : ""
                            }`}
                            >
                              {subItem.icon}
                              <span className="ml-4 font-sans text-sm font-bold">
                                {subItem.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              ) : (
                // Handle top-level items with 'href' but no 'menu' (already filtered)
                <div
                  onClick={() => router.push(item.href)}
                  onMouseEnter={() => setHoveredIndex(`${item.label}-${index}`)} // Use label + index
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center py-3 px-4 cursor-pointer transition duration-200 dark:text-gray-500
                ${
                  pathname.includes(item.href)
                    ? "bg-gray-800 text-gray-200"
                    : "hover:bg-gray-800 hover:text-gray-200"
                }`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="ml-3 font-sans text-sm font-bold">
                      {item.label}
                    </span>
                  )}
                  {isCollapsed && hoveredIndex === `${item.label}-${index}` && (
                    <span
                      className={`font-sans text-sm p-3 font-bold absolute left-full top-1/2 -translate-y-1/2 ml-2 z-10 w-max bg-gray-800 text-gray-200 delay-200 transition-all duration-200 whitespace-nowrap`}
                      style={{ left: "calc(100% + 0.5rem)" }} // Position to the right
                    >
                      {item.label}
                    </span>
                  )}
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
      {/* Note: The DarkMood and LanguageSwitcher were previously outside the nav.
          If they should remain visible when the nav scrolls, keep them outside. */}
    </div>
  );
}

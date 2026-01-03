"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigations({ dictionaries, lang }) {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[3];

  const links = [
    { name: "Home", href: "" },
    { name: "Welcome", href: "welcome" },
    { name: "Offerte in corso", href: "offerte-in-corso" },
    { name: "Listini", href: "listini" },
    { name: "Guide e Procedure", href: "guide-e-procedure" },
    { name: "Video Formativi", href: "video-formativi" },
    { name: "Academy", href: "academy" },
    { name: "Link Utili", href: "link-utili" },
    { name: "Trade Marketing", href: "trade-marketing" },
    { name: "Installatori FWA", href: "installatori-fwa" },
    { name: "Moduli Utili", href: "moduli-utili" },
  ];

  return (
    <nav className="w-64 min-h-screen border-r border-gray-200 bg-white">
      <div className="py-4 px-2">
        <div className="flex flex-col space-y-1">
          {links.map((link, index) => (
            <Link
              key={index}
              href={`/${lang}/customer/${link.href}`}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                currentPath === link.href ||
                (currentPath === undefined && link.href === "")
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

"use client";

import React from "react";
import Link from "next/link";

import { navbarLinks } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="border h-[90vh] hidden lg:block">
      <ul>
        {navbarLinks.map((link, index) => {
          const isActive =
            pathname === link.route ||
            (pathname.includes(link.route) && link.route !== "/");
          return (
            <li
              key={index}
              className={
                isActive
                  ? "px-4 py-1 text-primary bg-orange-500 text-white"
                  : "px-4 py-1 hover:bg-orange-500/10 transition border-b"
              }
            >
              <Link href={link.route} className="flex items-center gap-2">
                {link.icon}
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

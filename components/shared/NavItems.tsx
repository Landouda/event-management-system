"use client";

// ** Next Imports
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ** My Imports
import { headerLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";

const NavItems = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {isSignedIn
        ? headerLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.route}
                className={`${
                  isActive && "text-primary-500"
                } flex-center p-medium-16 whitespace-nowrap text-black`}
              >
                <Link href={link.route}>{link.label}</Link>
              </li>
            );
          })
        : null}
    </ul>
  );
};

export default NavItems;

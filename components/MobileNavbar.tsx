"use client";

// ** React Imports
import React from "react";

// ** Next.js Imports
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// ** Component Imports
import {
  Sheet,
  SheetClose,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

// ** Constants
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { navbarLinks } from "@/lib/constants";

const NavContent = () => {
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {navbarLinks.map((link, index) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;
        return (
          <SheetClose asChild key={index}>
            <Link
              href={link.route}
              className={`${
                isActive
                  ? "w-fit border-b-2 border-orange-500 dark:border-secondary"
                  : " text-black dark:text-white dark:hover:text-primary "
              }  text-2xl`}
            >
              <p
                className={`${
                  isActive ? "text-orange-500 dark:text-secondary" : ""
                }`}
              >
                {link.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
      <hr className="mt-5 h-0.5 bg-orange-500/70 dark:bg-secondary-dark" />
      <SheetClose asChild>
        <Link
          href="/sign-up"
          className=" text-black dark:text-white dark:hover:text-primary tracking-widest  text-2xl"
        >
          Sign up
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          href="/sign-in"
          className=" text-black dark:text-white dark:hover:text-primary tracking-widest  text-2xl"
        >
          Sign in
        </Link>
      </SheetClose>
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-transparent lg:hidden">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <Link href="/">
          <Image
            width={50}
            alt="logo"
            height={50}
            priority
            className="h-auto w-auto"
            src="https://tse1.mm.bing.net/th?id=OIP.AZzpm_572J4Cd94ts4YGSAD6D6&pid=Api&P=0&h=220"
          />
        </Link>
        <hr className="mt-5 h-0.5 bg-orange-500/70 dark:bg-secondary-dark" />
        <SheetClose asChild>
          <NavContent />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

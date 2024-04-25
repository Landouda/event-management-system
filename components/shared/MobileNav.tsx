import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";
import Link from "next/link";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            width={30}
            height={30}
            alt="Menu"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <Link href="/">
            <Image
              priority
              alt="logo"
              width={50}
              height={50}
              className="h-auto w-auto transition duration-300 ease-in-out transform active:scale-95"
              src="https://tse1.mm.bing.net/th?id=OIP.AZzpm_572J4Cd94ts4YGSAD6D6&pid=Api&P=0&h=220"
            />
          </Link>
          <Separator className="border border-gray-100" />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;

// ** Next Imports
import React from "react";
import Link from "next/link";
import Image from "next/image";

// ** My Imports
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { Button } from "../ui/button";

// ** Third Party Imports
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            priority
            alt="logo"
            width={50}
            height={50}
            className="h-auto w-auto transition duration-300 ease-in-out transform active:scale-95"
            src="https://tse1.mm.bing.net/th?id=OIP.AZzpm_572J4Cd94ts4YGSAD6D6&pid=Api&P=0&h=220"
          />
        </Link>

        <nav className="md:flex-between hidden w-full max-w-xs">
          <NavItems />
        </nav>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full bg-primary" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;

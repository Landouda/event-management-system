import Image from "next/image";
import React from "react";
import MobileNav from "../MobileNavbar";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex border bg-black text-white px-10 py-4 justify-between items-center h-[10vh]">
      <Link href="/">
        <Image
          width={50}
          height={50}
          alt="logo"
          priority
          className="h-auto w-auto transition duration-300 ease-in-out transform active:scale-95"
          src="https://tse1.mm.bing.net/th?id=OIP.AZzpm_572J4Cd94ts4YGSAD6D6&pid=Api&P=0&h=220"
        />
      </Link>

      <input
        className="bg-gray-800 border-none px-10 py-1 hidden lg:block"
        placeholder="Search"
      />

      <div className="flex gap-3 items-center">
        <button className="hidden lg:block"> sign in</button>
        <div className="bg-transparent lg:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}

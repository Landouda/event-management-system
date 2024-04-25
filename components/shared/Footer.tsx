// ** Next Imports
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
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

        <p>2023 Orange Event Management. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

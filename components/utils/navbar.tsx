import React from "react";

export default function Navbar() {
  return (
    <nav className="flex border bg-black text-white px-10 py-4 justify-between items-center h-[10vh]">
      
      <div>
        <img className="h-12 w-12" src="https://tse1.mm.bing.net/th?id=OIP.AZzpm_572J4Cd94ts4YGSAD6D6&pid=Api&P=0&h=220"/>
      </div>



      <div>
        <input className="bg-gray-800 border-none px-10 py-1" placeholder="Search" />

      </div>



      <div>
        <button> sign in</button>
      </div>
    </nav>
  );
}

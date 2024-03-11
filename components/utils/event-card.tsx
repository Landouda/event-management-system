import { MapPin, Pencil } from "lucide-react";
import React from "react";


type EventProps ={
  date: string;
  time: string;
  name: string;
  location: string;
  description?: string;
  category?: string;
}

export default function EventCard({date,name,location,description,time,category}:EventProps) {
  return (
    <div className=" relative transition group border border-orange-500 rounded-md p-8 hover:bg-orange-500 cursor-pointer">
      <p className="text-xs text-gray-500 group-hover:text-white">{date} {time}</p>
      <h1 className="text-lg font-bold text-orange-500 mt-2 group-hover:text-white">
       {name}
      </h1>
      <div className="flex gap-0.5 justify-start items-center text-xs mt-1 group-hover:text-white text-gray-500">
        <MapPin size={14} />
        <p>{location}</p>
      </div>
      <div className="flex gap-2 mt-4 ">
        <button className="p-1 border shadow-sm rounded-md text-gray-500 text-xs font-semibold grow absolute top-2 right-2">
        <Pencil size={14} />
        </button>
        <button className="p-1 border shadow-sm rounded-md text-xs font-semibold grow">delete</button>
        <button className="p-1 border shadow-sm rounded-md text-xs font-semibold grow ">archive</button>
      </div>
    </div>
  );
}

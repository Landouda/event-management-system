import React from "react";
import Link from "next/link";
import { CalendarDays, CircleHelp, Cog, Home, LineChart, PieChart, Users } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="border h-[90vh]">
      <ul>
        <li className="px-4 py-1 border-b hover:bg-slate-200 transition">
          <Link className="flex gap-2" href="/">
            <Home size={22}/>
            <p>Home</p>
          </Link>
        </li>

        <li className="px-4 py-1 border-b hover:bg-slate-200 transition">
          <Link className="flex gap-2" href="/dashboard"> 
          <LineChart />
          <p>Dashboard </p>
          </Link>
        </li>

        <li className="px-4 py-1 border-b hover:bg-slate-200 transition">
          <Link className="flex gap-2" href="/event">
          <CalendarDays />
            <p>Event</p>
              </Link>
        </li>

        <li className="px-4 py-1 border-b hover:bg-slate-200 transition">
          <Link  className="flex gap-2" href="/attendees"> 
          <Users />
          <p>Attendees</p> </Link>
        </li>

        <li className="px-4 py-1 border-b hover:bg-slate-200 transition">
          <Link className="flex gap-2" href="/analytics">
          <PieChart />
             <p>Analytics</p> </Link>
        </li>

        <li className="px-4 py-1 border-b hover:bg-slate-200 transition">
          <Link className="flex gap-2"href="/settings">
          <Cog />
             Settings </Link>
        </li>

        <li className="px-4 py-1 border-b hover:bg-slate-200 transition">
          <Link className="flex gap-2" href="/help">
          <CircleHelp />
            <p>Help</p> </Link>
        </li>
      </ul>
    </div>
  );
}

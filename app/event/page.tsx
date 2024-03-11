"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DateSelect } from "@/components/utils/date-select";
import { CategorySelect } from "@/components/utils/category-select";
import EventCard from "@/components/utils/event-card";
import AddEvent from "@/components/forms/add-event";
import CustomDrawer from "@/components/utils/custom-drawer";
import AddAttendee from "@/components/forms/add-attendees";

const events = [
  {
    date: "2024-11-10",
    time: "6:00 PM",
    name: "Data Science Conference",
    location: "Tunis, Tunisia",
    description: "A conference focusing on the latest trends in data science.",
    category: "Conference",
  },
  {
    date: "2024-12-05",
    time: "10:00 AM",
    name: "Marketing Seminar",
    location: "New York City, USA",
    description: "A seminar discussing effective marketing strategies.",
    category: "Seminar",
  },
  {
    date: "2025-01-15",
    time: "2:00 PM",
    name: "Photography Workshop",
    location: "London, UK",
    description: "A hands-on workshop for photography enthusiasts.",
    category: "Workshop",
  },
  {
    date: "2025-02-20",
    time: "7:30 PM",
    name: "Web Development Bootcamp",
    location: "San Francisco, USA",
    description: "An intensive bootcamp for learning web development.",
    category: "Workshop",
  },
  {
    date: "2025-03-12",
    time: "8:00 PM",
    name: "Digital Marketing Summit",
    location: "Sydney, Australia",
    description: "A summit bringing together experts in digital marketing.",
    category: "Conference",
  },
  {
    date: "2025-04-18",
    time: "5:30 PM",
    name: "Music Concert",
    location: "Paris, France",
    description: "A live concert featuring popular artists.",
    category: "Concert",
  },
  {
    date: "2025-05-25",
    time: "11:00 AM",
    name: "Art Exhibition",
    location: "Berlin, Germany",
    description: "An exhibition showcasing contemporary art pieces.",
    category: "Exhibition",
  },
  {
    date: "2025-06-30",
    time: "4:00 PM",
    name: "Tech Startup Networking ",
    location: "Tokyo, Japan",
    description: "A networking event for tech startup founders and investors.",
    category: "Networking Event",
  },
  {
    date: "2025-07-08",
    time: "9:00 AM",
    name: "Charity Fundraiser Gala",
    location: "Los Angeles, USA",
    description: "A gala event to raise funds for charitable causes.",
    category: "Fundraiser",
  },
  {
    date: "2025-08-22",
    time: "1:00 PM",
    name: "Food Festival",
    location: "Rome, Italy",
    description:
      "A festival celebrating diverse cuisines from around the world.",
    category: "Festival",
  },
];

enum Tabs {
  Event,
  Attendees,
  Mail,
}

export default function Event() {
  const [tab, setTabs] = useState(Tabs.Event);
  return (
    <div className="">
      <CustomDrawer
        name={"Add Event"}
        header={"Create Event"}
        description={"fill out this form, and make sure to save the changes."}
      >
        <div className="flex my-10">
          <div className="flex flex-col gap-2 px-10 justify-between ">
            <button
              className={cn(
                "h-10 w-10 border rounded-full flex justify-center items-center",
                tab == Tabs.Event && "border-green-300 text-green-300"
              )}
              onClick={() => setTabs(Tabs.Event)}
            >
              1
            </button>
            <button
              className={cn(
                "h-10 w-10 border rounded-full flex justify-center items-center",
                tab == Tabs.Attendees && "border-green-300 text-green-300"
              )}
              onClick={() => setTabs(Tabs.Attendees)}
            >
              2
            </button>
            <button
              className={cn(
                "h-10 w-10 border rounded-full flex justify-center items-center",
                tab == Tabs.Mail && "border-green-300 text-green-300"
              )}
              onClick={() => setTabs(Tabs.Mail)}
            >
              3
            </button>
          </div>
          <div className="grow">
            {tab == Tabs.Event && <AddEvent />}
            {tab == Tabs.Attendees && <AddAttendee />}
          </div>
        </div>
        <Button type="submit">Save changes</Button>
      </CustomDrawer>
      <div className="grid grid-cols-4 gap-2">
        {events.map((event, index) => {
          return (
            <EventCard
              key={index}
              date={event.date}
              time={event.time}
              name={event.name}
              location={event.location}
            />
          );
        })}
      </div>
    </div>
  );
}

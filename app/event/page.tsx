"use client";
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import { Button } from "@/components/ui/button";
>>>>>>> edfdd14b985b041ae0090cd6c30a971bcfa95181
import { cn } from "@/lib/utils";
import EventCard from "@/components/utils/event-card";
import AddEvent from "@/components/forms/add-event";
import CustomDrawer from "@/components/utils/custom-drawer";
<<<<<<< HEAD
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { OrangeEvent } from "@/lib/types";
=======
import AddAttendee from "@/components/forms/add-attendees";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

type Event = {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  category: string;
};
>>>>>>> edfdd14b985b041ae0090cd6c30a971bcfa95181

enum Tabs {
  Event,
  Attendees,
}

export default function Event() {
  // ** States
<<<<<<< HEAD
  const [events, setEvents] = useState<OrangeEvent[]>([]);
=======
  const [tab, setTabs] = useState(Tabs.Event);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState<undefined | string>(undefined);
>>>>>>> edfdd14b985b041ae0090cd6c30a971bcfa95181

  // ** Functions
  const getEvents = async () => {
    try {
      const collectionRef = collection(db, "events");
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => {
        const eventData = doc.data();
        return {
          id: doc.id,
<<<<<<< HEAD
          time: eventData.time,
          title: eventData.title,
          location: eventData.location,
          category: eventData.category,
          attendees: eventData.attendees,
          isArchived: eventData.isArchived,
          description: eventData.description,
          date: eventData.date.toDate().toLocaleDateString(),
          totalPeopleAttending: eventData.total_people_attending,
        };
      });

      setEvents([...data]);
=======
          title: eventData.title,
          location: eventData.location,
          description: eventData.description,
          category: eventData.category,
          date: new Date(eventData.date.seconds * 1000),
        };
      });

      setEvents(data);
>>>>>>> edfdd14b985b041ae0090cd6c30a971bcfa95181
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  // ** Hooks
  useEffect(() => {
    getEvents();
  }, []);

  return (
<<<<<<< HEAD
    <div className="w-full space-y-3">
      <CustomDrawer />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {events.length > 0 ? (
          events
            .filter((event) => !event.isArchived)
            .map((event, index) => {
              return <EventCard key={index} event={event} />;
            })
        ) : (
          <div>
            <h1>No events found</h1>
          </div>
        )}
=======
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
          </div>
          <div className="grow">
            {tab == Tabs.Event && (
              <AddEvent setTabs={setTabs} setEventId={setEventId} />
            )}
            {tab == Tabs.Attendees && <AddAttendee eventId={eventId} />}
          </div>
        </div>
      </CustomDrawer>
      <div className="grid grid-cols-4 gap-2">
        {events.map((event, index) => {
          return (
            <EventCard
              key={index}
              name={event.title}
              location={event.location}
              date={event.date.toUTCString()}
              time={event.date.toTimeString()}
            />
          );
        })}
>>>>>>> edfdd14b985b041ae0090cd6c30a971bcfa95181
      </div>
    </div>
  );
}

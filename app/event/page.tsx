"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import EventCard from "@/components/utils/event-card";
import AddEvent from "@/components/forms/add-event";
import CustomDrawer from "@/components/utils/custom-drawer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { OrangeEvent } from "@/lib/types";

enum Tabs {
  Event,
  Attendees,
}

export default function Event() {
  // ** States
  const [events, setEvents] = useState<OrangeEvent[]>([]);

  // ** Functions
  const getEvents = async () => {
    try {
      const collectionRef = collection(db, "events");
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => {
        const eventData = doc.data();
        return {
          id: doc.id,
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
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  // ** Hooks
  useEffect(() => {
    getEvents();
  }, []);

  return (
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
      </div>
    </div>
  );
}

"use client";

import { db } from "@/firebase";
import { OrangeEvent } from "@/lib/types";
import React, { useEffect, useState } from "react";
import EventCard from "@/components/utils/event-card";
import { collection, getDocs } from "firebase/firestore";

const Archive = () => {
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
    <div className="grid grid-cols-4 gap-2 h-fit">
      {events
        .filter((event) => event.isArchived)
        .map((event, index) => {
          return <EventCard key={index} event={event} />;
        })}
    </div>
  );
};

export default Archive;

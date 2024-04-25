"use client";

import EventCard from "@/components/shared/EventCard";
import { IEvent, getAllEvents } from "@/lib/actions/event.actions";
import React, { useEffect, useState } from "react";

const ArchivedPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  useEffect(() => {
    const getEvents = async () => {
      const events = await getAllEvents();

      if (events) {
        setEvents(events);
      }
    };

    getEvents();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3">
      {events.length === 0 && <p>No archived events</p>}
      {events
        .filter((event) => event.isArchived)
        .map((event) => (
          <EventCard key={event.id} event={event} setEvents={setEvents} />
        ))}
    </div>
  );
};

export default ArchivedPage;

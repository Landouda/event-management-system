"use client";

import { IEvent, getAllEvents } from "@/lib/actions/event.actions";
import React, { useEffect, useState } from "react";

const getTotalNumberOfEvents = (events: IEvent[]) => events.length;

const getEventsByCategory = (events: IEvent[]) => {
  const categories = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return categories;
};

const getTotalNumberOfAttendees = (events: IEvent[]) =>
  events.reduce((total, event) => total + event.totalPeopleAttending, 0);

const getAverageNumberOfAttendeesPerEvent = (events: IEvent[]) =>
  getTotalNumberOfAttendees(events) / getTotalNumberOfEvents(events);

const getAttendanceRate = (events: IEvent[]) => {
  const totalAttendees = getTotalNumberOfAttendees(events);
  const totalAttending = events.reduce(
    (total, event) =>
      total + event.attendees.filter((attendee) => attendee.isAttending).length,
    0
  );
  return totalAttending / totalAttendees;
};

const getArchivedVsActiveEvents = (events: IEvent[]) => {
  const archived = events.filter((event) => event.isArchived).length;
  const active = getTotalNumberOfEvents(events) - archived;
  return { archived, active };
};

const getEventsOverTime = (events: IEvent[]) => {
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date.toDate().toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return eventsByDate;
};

const getAttendeesOverTime = (events: IEvent[]) => {
  const attendeesByDate = events.reduce((acc, event) => {
    const date = event.date.toDate().toDateString();
    event.attendees.forEach((attendee) => {
      if (attendee.isAttending) {
        acc[date] = (acc[date] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);
  return attendeesByDate;
};

const getEmailDomainDistribution = (events: IEvent[]) => {
  const domains = events.reduce((acc, event) => {
    event.attendees.forEach((attendee) => {
      const domain = attendee.email.split("@")[1];
      acc[domain] = (acc[domain] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  return domains;
};

const AnalyticsPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getAllEvents();

      setEvents(response ? response : []);
    };

    fetchEvents();
  }, []);

  const attendanceRate = getAttendanceRate(events);
  const eventsOverTime = getEventsOverTime(events);
  const eventsByCategory = getEventsByCategory(events);
  const attendeesOverTime = getAttendeesOverTime(events);
  const totalNumberOfEvents = getTotalNumberOfEvents(events);
  const totalNumberOfAttendees = getTotalNumberOfAttendees(events);
  const archivedVsActiveEvents = getArchivedVsActiveEvents(events);
  const emailDomainDistribution = getEmailDomainDistribution(events);
  const averageNumberOfAttendeesPerEvent =
    getAverageNumberOfAttendeesPerEvent(events);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Events Analytics
        </h3>
      </section>
      <div className="wrapper my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Total Number of Events</h4>
            <p className="font-semibold">{totalNumberOfEvents}</p>
          </div>
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Events by Category</h4>
            <ul>
              {Object.entries(eventsByCategory).map(([category, count]) => (
                <li key={category}>
                  {category}: {count}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Total Number of Attendees</h4>
            <p className="font-semibold">{totalNumberOfAttendees}</p>
          </div>
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Average Number of Attendees per Event</h4>
            <p className="font-semibold">{averageNumberOfAttendeesPerEvent}</p>
          </div>
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Attendance Rate</h4>
            <p className="font-semibold">{attendanceRate}</p>
          </div>
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Archived vs Active Events</h4>
            <p className="font-semibold">
              Archived: {archivedVsActiveEvents.archived}
            </p>
            <p className="font-semibold">
              Active: {archivedVsActiveEvents.active}
            </p>
          </div>
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Email Domain Distribution</h4>
            <ul>
              {Object.entries(emailDomainDistribution).map(
                ([domain, count]) => (
                  <li key={domain}>
                    {domain}: {count}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="bg-white p-5 rounded">
            <h4 className="h4-bold">Events Over Time</h4>
            <ul>
              {Object.entries(eventsOverTime).map(([date, count]) => (
                <li key={date}>
                  {date}: {count}
                </li>
              ))}
            </ul>

            <h4 className="h4-bold">Attendees Over Time</h4>
            <ul>
              {Object.entries(attendeesOverTime).map(([date, count]) => (
                <li key={date}>
                  {date}: {count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;

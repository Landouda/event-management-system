"use client";

import ApexChart from "@/components/shared/ApexChart";
import { IEvent, getAllEvents } from "@/lib/actions/event.actions";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";

const donutColors = {
  series1: "#7367F0",
  series2: "#28C76F",
  series3: "#EA5455",
  series4: "#FF9F43",
  series5: "#9C27B0",
};

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
  const emailDomainDistribution = getEmailDomainDistribution(events);
  const averageNumberOfAttendeesPerEvent =
    getAverageNumberOfAttendeesPerEvent(events);

  const eventsByCategoryOptions: ApexOptions = {
    stroke: { width: 0 },
    colors: [donutColors.series1, donutColors.series2],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      markers: { offsetX: -3 },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: Object.keys(eventsByCategory),
    },
  };
  const { archived, active } = getArchivedVsActiveEvents(events);

  const archivedVsActiveEventsOptions: ApexOptions = {
    stroke: { width: 0 },
    labels: ["Archived", "Active"],
    colors: [donutColors.series1, donutColors.series2],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      markers: { offsetX: -3 },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "1.2rem",
            },
            value: {
              fontSize: "1.2rem",
              fontWeight: "bold",
              formatter: (val: any) =>
                `${Math.round((parseFloat(val) / totalNumberOfEvents) * 100)}%`,
              color: "#7367F0",
            },
            total: {
              show: true,
              color: "#7367F0",
              fontSize: "1.2rem",
              fontWeight: "bold",
              label: "Total Events",
              formatter: () => `${totalNumberOfEvents}`,
            },
          },
        },
      },
    },
  };

  const emailDomainDistributionOptions: ApexOptions = {
    stroke: { width: 0 },
    labels: Object.keys(emailDomainDistribution),
    colors: [
      donutColors.series1,
      donutColors.series2,
      donutColors.series3,
      donutColors.series4,
      donutColors.series5,
    ],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      markers: { offsetX: -3 },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "1.2rem",
            },
            value: {
              fontSize: "1.2rem",
              fontWeight: "bold",
              formatter: (val: any) =>
                `${Math.round((parseFloat(val) / totalNumberOfEvents) * 100)}%`,
              color: "#7367F0",
            },
            total: {
              show: true,
              color: "#7367F0",
              fontSize: "1.2rem",
              fontWeight: "bold",
              label: "Total Domains",
              formatter: () => `${Object.keys(emailDomainDistribution).length}`,
            },
          },
        },
      },
    },
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Events Analytics
        </h3>
      </section>
      <div className="wrapper my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-orange-500">
            <h4 className="h4-bold">Total Number of Events</h4>
            <p className="font-semibold">{totalNumberOfEvents}</p>
          </div>
          <div className="bg-white border border-orange-500 p-5 rounded-2xl">
            <h4 className="h4-bold">
              Total Number of Attendees Across All Events
            </h4>
            <p className="font-semibold">{totalNumberOfAttendees}</p>
          </div>
          <div className="bg-white  border border-orange-500 rounded-2xl">
            <h4 className="h4-bold p-5">Events by Category</h4>
            <ApexChart
              type="bar"
              height={350}
              options={eventsByCategoryOptions}
              series={[
                {
                  name: "Events",
                  data: Object.values(eventsByCategory),
                },
              ]}
            />
          </div>
          <div className="bg-white border border-orange-500 p-5 rounded-2xl">
            <h4 className="h4-bold">Email Domain Distribution</h4>
            <ApexChart
              type="donut"
              height={350}
              options={emailDomainDistributionOptions}
              series={Object.values(emailDomainDistribution)}
            />
          </div>
          {/* <div className="bg-white border border-orange-500 rounded-2xl">
            <h4 className="h4-bold p-5">Archived vs Active Events</h4>
            <ApexChart
              type="donut"
              height={350}
              options={archivedVsActiveEventsOptions}
              series={[archived, active]}
            />
          </div> */}

          <div className="bg-white border border-orange-500 p-5 rounded-2xl">
            <h4 className="h4-bold">Average Number of Attendees per Event</h4>
            <p className="font-semibold">{averageNumberOfAttendeesPerEvent}</p>
          </div>
          <div className="bg-white border border-orange-500 p-5 rounded-2xl">
            <h4 className="h4-bold">Attendance Rate</h4>
            <p className="font-semibold">{attendanceRate}</p>
          </div>

          {/* <div className="bg-white border border-orange-500 p-5 rounded-2xl">
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;

"use client";

import { ApexOptions } from "apexcharts";
import ApexChart from "@/components/shared/ApexChart";
import { IEvent, getEventById } from "@/lib/actions/event.actions";
import { useEffect, useState } from "react";

type EventAnalyticsProps = {
  params: {
    id: string;
  };
};

const donutColors = {
  series1: "#7367F0",
  series2: "#28C76F",
  series3: "#EA5455",
  series4: "#FF9F43",
  series5: "#9C27B0",
};

const EventAnalytics = ({ params: { id } }: EventAnalyticsProps) => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);

  useEffect(() => {
    const fetchEvent = async () => {
      const fetchedEvent = await getEventById(id);
      setEvent(fetchedEvent);
    };

    fetchEvent();
  }, [id]);

  const renderCharts = (event: IEvent) => {
    const totalAttendees = event.attendees.length;
    const attendingCount = event.attendees.filter((a) => a.isAttending).length;
    const notAttendingCount = totalAttendees - attendingCount;

    const options: ApexOptions = {
      stroke: { width: 0 },
      labels: ["Attending", "Not Attending"],
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
                formatter: (val: string) =>
                  `${Math.round((parseFloat(val) / totalAttendees) * 100)}%`,
                color: "#7367F0",
              },
              total: {
                show: true,
                color: "#7367F0",
                fontSize: "1.2rem",
                fontWeight: "bold",
                label: "Total Attendees",
                formatter: () => `${totalAttendees}`,
              },
            },
          },
        },
      },
    };

    return (
      <div className="flex flex-col gap-3 border border-orange-500 p-4 rounded-2xl">
        <h4 className="h5-bold">
          The percentage of attendees who are attending the event
        </h4>
        <p className="text-sm text-gray-500">
          This chart shows the percentage of attendees who are attending the
          event.
        </p>
        <ApexChart
          type="donut"
          height={400}
          width="100%"
          options={options}
          series={[attendingCount, notAttendingCount]}
        />
        {event.attendees.length > 0 && (
          <div className="flex gap-3 flex-col">
            <p className="font-semibold">
              {event.attendees.length}
              {event.attendees.length === 1 ? " Attendee " : " Attendees "}
              Invited
            </p>
            <table className="w-full table-auto rounded">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left bg-grey-50 text-black">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left bg-grey-50 text-black">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left bg-grey-50 text-black">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {event.attendees.map((attendee, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{attendee.name}</td>
                    <td className="border px-4 py-2">{attendee.email}</td>
                    <td className="border px-4 py-2">
                      {attendee.isAttending
                        ? attendee.isAttending === true
                          ? "Attending"
                          : "Not Attending"
                        : "Not response Yet"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {event ? (
        <>
          <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
            <h3 className="wrapper h3-bold text-center sm:text-left">
              {event.title} Analytics
            </h3>
          </section>

          <div className="wrapper my-8">{renderCharts(event)}</div>
        </>
      ) : (
        <p>No event found</p>
      )}
    </>
  );
};

export default EventAnalytics;

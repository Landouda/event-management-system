"use client";

// ** Next Imports
import Link from "next/link";
import Image from "next/image";

// ** Third-Party Imports
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/shared/EventCard";
import { IEvent, getAllEvents } from "@/lib/actions/event.actions";

export default function Home() {
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
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            alt="hero"
            width={1000}
            height={1000}
            src="/assets/images/hero.png"
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          {/* <Search /> */}
          {/* <CategoryFilter /> */}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3">
          {events
            .filter((event) => !event.isArchived)
            .map((event) => (
              <EventCard key={event.id} event={event} setEvents={setEvents} />
            ))}
        </div>
      </section>
    </>
  );
}

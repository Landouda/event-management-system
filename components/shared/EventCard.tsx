import React from "react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Trash2, Edit, Archive, ArchiveRestore, PieChart } from "lucide-react";
import {
  IEvent,
  deleteEvent,
  archiveEvent,
  unarchiveEvent,
} from "@/lib/actions/event.actions";
import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const EventCard = ({
  event,
  setEvents,
}: {
  event: IEvent;
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
}) => {
  // ** Hooks
  const router = useRouter();

  const handleEventArchive = async () => {
    await archiveEvent(event.id);
    setEvents((prevEvents) =>
      prevEvents.map((prevEvent) =>
        prevEvent.id === event.id
          ? { ...prevEvent, isArchived: true }
          : prevEvent
      )
    );
  };

  const handleEventUnArchive = async () => {
    await unarchiveEvent(event.id);
    setEvents((prevEvents) =>
      prevEvents.map((prevEvent) =>
        prevEvent.id === event.id
          ? { ...prevEvent, isArchived: false }
          : prevEvent
      )
    );
  };

  const handleDeleteEvent = async () => {
    await deleteEvent(event.id);
    setEvents((prevEvents) =>
      prevEvents.filter((prevEvent) => prevEvent.id !== event.id)
    );
  };

  const handleEventAnalytics = () => {
    router.push(`/events/${event.id}/analytics`);
  };

  return (
    <div className="rounded-md relative h-full flex gap-5 flex-col p-5 border border-primary transition duration-150 ease-in-out">
      <Badge variant="secondary" className="w-fit">
        {event.category}
      </Badge>
      <SignedIn>
        <div className="absolute right-3 top-3 flex flex-col shadow-md rounded-md">
          <Link
            href={`events/${event.id}/update `}
            className="hover:bg-orange-100 p-2 rounded-t-md transition ease-in-out duration-150 cursor-pointer"
          >
            <Edit size={24} color="blue" />
          </Link>
          <div className="hover:bg-orange-100 p-2 transition ease-in-out duration-150 cursor-pointer">
            {event.isArchived ? (
              <ArchiveRestore
                size={24}
                color="orange"
                onClick={handleEventUnArchive}
              />
            ) : (
              <Archive size={24} color="orange" onClick={handleEventArchive} />
            )}
          </div>
          <div className="hover:bg-orange-100 p-2  transition ease-in-out duration-150 cursor-pointer">
            <PieChart size={24} color="grey" onClick={handleEventAnalytics} />
          </div>
          <div className="hover:bg-orange-100 p-2 rounded-b-md transition ease-in-out duration-150 cursor-pointer">
            <Trash2 size={24} color="red" onClick={handleDeleteEvent} />
          </div>
        </div>
      </SignedIn>
      <div className="flex items-center gap-1">
        <p>{event.date.toDate().toLocaleDateString()}</p>
        <p>{event.time}</p>
      </div>
      <h3 className="h5-bold">{event.title}</h3>
      <p className="p-regular-16">{event.description}</p>
    </div>
  );
};

export default EventCard;

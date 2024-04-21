import React from "react";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { db } from "@/firebase";
import { Button } from "../ui/button";
import { OrangeEvent } from "@/lib/types";
import { deleteDoc, doc, collection, updateDoc } from "firebase/firestore";
import {
  Trash2,
  MapPin,
  Archive,
  ArchiveRestore,
  PieChart,
} from "lucide-react";
import CustomDrawer from "./custom-drawer";
import events from "events";

type EventProps = {
  event: OrangeEvent;
  events: OrangeEvent[];
  setEvents: React.Dispatch<React.SetStateAction<OrangeEvent[]>>;
};

export default function EventCard({ event, events, setEvents }: EventProps) {
  const eventsCollection = collection(db, "events");
  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(eventsCollection, id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateDoc(doc(eventsCollection, id), {
        isArchived: event.isArchived ? false : true,
      });
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, isArchived: !event.isArchived } : event
        )
      );
    } catch (error) {
      console.error("Error archiving event: ", error);
    }
  };

  return (
    <div className="relative transition group border border-orange-500 rounded-md p-8 hover:bg-orange-500 cursor-pointer">
      <p className="text-xs text-gray-500 group-hover:text-white">
        {event.date} {event.time}
      </p>
      <h1 className="text-lg font-bold text-orange-500 mt-2 group-hover:text-white">
        {event.title}
      </h1>
      <div className="flex gap-0.5 justify-start items-center text-xs mt-1 group-hover:text-white text-gray-500">
        <MapPin size={14} />
        <p>{event.location}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4 ">
        <div className="absolute top-8 right-8">
          <CustomDrawer event={event} setEvents={setEvents} events={events} />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" size="sm" variant="outline">
              <Trash2 size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteEvent(event.id)}
                className="bg-red-500 hover:bg-red-600 active:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" size="sm" variant="outline">
              {event.isArchived ? (
                <ArchiveRestore size={20} />
              ) : (
                <Archive size={20} />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {event.isArchived
                  ? " This action will restore this event and add it back to the main page. "
                  : "This action will archive this event and remove it from the main page."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleArchive(event.id)}>
                {event.isArchived ? "Restore" : "Archive"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" size="sm" variant="outline">
              <PieChart size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Event Analytics</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex items-center flex-col gap-3">
                  <p>Here are the analytics for this event.</p>
                  <div className="flex gap-3 flex-col lg:flex-row items-center">
                    <p>Total people invited: {event.attendees.length}</p>
                    <p>
                      Total people attended: {event.totalPeopleAttending || 0}
                    </p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

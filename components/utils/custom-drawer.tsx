import React, { useState } from "react";
import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { OrangeEvent } from "@/lib/types";
import { CalendarIcon, Pen, Plus, Users } from "lucide-react";

import AddAttendee from "../forms/add-attendees";
import AddEventForm from "../forms/add-event";

type DrawerProps = {
  event?: OrangeEvent;
};

export enum Tabs {
  Event,
  Attendees,
}

export default function CustomDrawer({ event }: DrawerProps) {
  // ** States
  const [open, setOpen] = useState(false);
  const [tab, setTabs] = useState(Tabs.Event);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {event ? (
          <Button size="sm" variant="outline">
            <Pen size={22} />
          </Button>
        ) : (
          <Button className="flex items-center gap-2">
            <Plus size={22} />
            <p>Create Event</p>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {event ? `Edit ${event.title}` : "Create Event"}
          </DrawerTitle>
          <DrawerDescription>
            Fill out this form, and make sure to save the changes.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col lg:flex-row items-center gap-3 px-5">
          <div className="flex lg:flex-col gap-14 justify-between">
            <Button
              onClick={() => setTabs(Tabs.Event)}
              variant="outline"
              className={`w-fit rounded-full py-7
              ${
                tab === Tabs.Event
                  ? "bg-primary text-white hover:bg-primary-600 hover:text-white"
                  : "text-muted-foreground"
              }
            `}
            >
              <CalendarIcon />
            </Button>
            <Button
              onClick={() => setTabs(Tabs.Attendees)}
              variant="outline"
              className={`w-fit rounded-full py-7
              ${
                tab === Tabs.Attendees
                  ? "bg-primary text-white hover:bg-primary-600 hover:text-white"
                  : "text-muted-foreground"
              }
            `}
            >
              <Users />
            </Button>
          </div>
          {tab === Tabs.Event ? (
            <AddEventForm event={event} setTabs={setTabs} />
          ) : (
            <AddAttendee orangeEvent={event} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

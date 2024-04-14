import * as XLSX from "xlsx";
import { db } from "@/firebase";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { DrawerClose } from "../ui/drawer";
import CustomTable from "../utils/custom-table";
import { ColumnDef } from "@tanstack/react-table";
import { Attendee, OrangeEvent } from "@/lib/types";
import { collection, doc, setDoc } from "firebase/firestore";

// ** Constants
export const columns: ColumnDef<Attendee>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

interface AddAttendeeProps {
  orangeEvent: OrangeEvent | undefined;
}

export default function AddAttendee({ orangeEvent }: AddAttendeeProps) {
  // ** States
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isAttendeesUploaded, setIsAttendeesUploaded] = useState(false);

  // ** Constants
  const eventsRef = collection(db, "events");

  // ** Functions
  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const result = event?.target?.result;
      if (result && typeof result !== "string") {
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setAttendees(jsonData as Attendee[]);
        setIsAttendeesUploaded(true);
      } else {
        console.error("File could not be read");
      }
    };

    reader.onerror = (event) => {
      console.error("File could not be read! Error: ", event);
    };

    reader.readAsArrayBuffer(file);
  };

  const addAttendeesToEvent = async () => {
    // ** Get Event based on the eventId
    if (!orangeEvent) {
      console.error("No event found");
      return;
    }

    try {
      // ** Update the attendees
      await setDoc(
        doc(eventsRef, orangeEvent.id),
        {
          attendees,
        },
        { merge: true }
      );
      fetch(`/api/send-email/${orangeEvent.id}`, {
        method: "POST",
        body: JSON.stringify(attendees),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="grid items-start gap-4 w-full mb-5 px-6">
      <Label>Attendees</Label>
      <Input type="file" onChange={handleFileUpload}></Input>
      <CustomTable
        columns={columns}
        data={
          isAttendeesUploaded
            ? attendees
            : orangeEvent
            ? orangeEvent.attendees
            : []
        }
      />
      <DrawerClose asChild>
        <div className="flex items-center flex-col md:flex-row gap-3">
          <Button
            type="submit"
            className="w-full"
            onClick={addAttendeesToEvent}
          >
            {orangeEvent ? "Update" : "Add"} Attendees
          </Button>
          <Button className="w-full" variant="outline">
            Cancel
          </Button>
        </div>
      </DrawerClose>
    </div>
  );
}

import * as XLSX from "xlsx";
import { db } from "@/firebase";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { DrawerClose } from "../ui/drawer";
import CustomTable from "../utils/custom-table";
import { ColumnDef } from "@tanstack/react-table";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export type Attendee = {
  name: string;
  last_name: string;
  email: string;
  number: number;
};

export const columns: ColumnDef<Attendee>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "number",
    header: "Number",
  },
];

interface AddAttendeeProps {
  eventId: string | undefined;
}

export default function AddAttendee({ eventId }: AddAttendeeProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const eventsRef = collection(db, "events");

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
      } else {
        console.error("File could not be read");
      }
    };

    reader.onerror = (event) => {
      console.error("File could not be read! Code ");
    };

    reader.readAsArrayBuffer(file);
  };

  const addAttendeesToEvent = async () => {
    // ** Get Event based on the eventId
    const event = await getDoc(doc(eventsRef, eventId));

    try {
      // ** Update the attendees
      await setDoc(doc(eventsRef, eventId), {
        ...event.data(),
        attendees,
      });
      fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify(attendees),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="grid items-start gap-4">
      <Label>Attendees</Label>
      <Input type="file" onChange={handleFileUpload}></Input>
      <CustomTable columns={columns} data={attendees} />
      <DrawerClose asChild>
        <Button onClick={addAttendeesToEvent}>Add Attendees</Button>
      </DrawerClose>
    </div>
  );
}

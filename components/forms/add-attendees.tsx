import React, { useState } from "react";
import { Input } from "../ui/input";
import * as XLSX from "xlsx";
import CustomTable from "../utils/custom-table";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "../ui/label";

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

export default function AddAttendee() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
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
        console.log(jsonData); // Logging the JSON data
      } else {
        console.error("File could not be read");
      }
    };

    reader.onerror = (event) => {
      console.error("File could not be read! Code ");
    };

    reader.readAsArrayBuffer(file);
  };    
  return (
    <div className="grid items-start gap-4">
      <Label>Attendees</Label>
      <Input type="file" onChange={handleFileUpload}></Input>
      <CustomTable columns={columns} data={attendees} />
    </div>
  );
}

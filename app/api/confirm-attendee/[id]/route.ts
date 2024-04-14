import { Attendee } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // const { email } = await req.json();
  // const eventId = req.nextUrl.pathname.split("/").pop()!;
  // // Check if the event exists
  // const eventRef = db.collection("events").doc(eventId);
  // const eventDoc = await eventRef.get();
  // if (!eventDoc.exists) {
  //   console.log("No such event.");
  //   return NextResponse.json({
  //     result: 404,
  //     message: "No such event",
  //   });
  // }
  // // Check if the email exists in the attendees list
  // const event = eventDoc.data()!;
  // if (event.attendees.some((attendee: Attendee) => attendee.email === email)) {
  //   // Increment the total number of people attending and update the event
  //   await eventRef.update({
  //     total: admin.firestore.FieldValue.increment(1),
  //   });
  //   console.log("Attendee confirmed successfully.");
  //   return NextResponse.json({
  //     result: 200,
  //     message: "Attendee confirmed successfully",
  //   });
  // } else {
  //   console.log("No such attendee.");
  //   return NextResponse.json({
  //     result: 404,
  //     message: "No such attendee",
  //   });
  // }
};

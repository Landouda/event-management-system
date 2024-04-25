import { db } from "@/firebase";
import { Attendee, IEvent } from "@/lib/actions/event.actions";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const eventId = params.get("eventId");
  const email = params.get("email");

  const eventRef = doc(db, "events", String(eventId));
  const eventDoc = await getDoc(eventRef);

  const event = eventDoc.data() as IEvent;

  if (
    event &&
    event.attendees &&
    event.attendees.some((attendee: Attendee) => attendee.email === email)
  ) {
    let attendees = event.attendees;
    const index = attendees.findIndex((att) => att.email === email);
    if (attendees[index].isAttending) {
      return NextResponse.json({
        result: 400,
        message: "Attendee already confirmed",
      });
    }
    if (index !== -1) {
      attendees[index].isAttending = true;
    } else {
      console.log("No attendee found with that email");
    }
    await updateDoc(eventRef, {
      ...event,
      totalPeopleAttending: increment(1),
    });
    return NextResponse.json({
      result: 200,
      message: "Attendee confirmed successfully",
    });
  } else {
    return NextResponse.json({
      result: 200,
      message: "No such attendee",
    });
  }
};

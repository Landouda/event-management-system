import { db } from "@/firebase";
import { Attendee, IEvent } from "@/lib/actions/event.actions";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const attendeesToAdd: Attendee[] = await req.json(); // Expecting an array of attendees

  const params = req.nextUrl.searchParams;
  const eventId = params.get("eventId");

  const eventRef = doc(db, "events", String(eventId));
  const eventDoc = await getDoc(eventRef);

  const event = eventDoc.data() as IEvent;
  if (!event) {
    return NextResponse.json({
      result: 404,
      message: "Event not found",
    });
  }

  let newAttendees = [];
  let count = 0;

  attendeesToAdd.forEach((incomingAttendee) => {
    const isAlreadyInvited = event.attendees.some(
      (attendee: Attendee) => attendee.email === incomingAttendee.email
    );
    if (!isAlreadyInvited) {
      let attendee: Attendee = {
        name: incomingAttendee.name,
        email: incomingAttendee.email,
        isAttending: true,
      };
      event.attendees.push(attendee);
      newAttendees.push(attendee);
      count++;
    }
  });

  if (newAttendees.length > 0) {
    await updateDoc(eventRef, {
      attendees: event.attendees,
      totalPeopleAttending: increment(count),
    });
    return NextResponse.json({
      result: 200,
      message: `Added ${newAttendees.length} new attendees`,
    });
  } else {
    return NextResponse.json({
      result: 400,
      message: "No new attendees added. Some or all were already invited.",
    });
  }
};

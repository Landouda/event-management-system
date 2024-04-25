import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const collectionRef = collection(db, "events");
  const querySnapshot = await getDocs(collectionRef);
  const data = querySnapshot.docs
    .map((doc) => {
      const eventData = doc.data();

      // Only return events that are not archived
      if (!eventData.isArchived) {
        return {
          id: doc.id,
          time: eventData.time,
          title: eventData.title,
          location: eventData.location,
          category: eventData.category,
          attendees: eventData.attendees,
          isArchived: eventData.isArchived,
          description: eventData.description,
          date: eventData.date.toDate().toLocaleDateString(),
          totalPeopleAttending: eventData.totalPeopleAttending,
        };
      }
    })
    .filter((event) => event);
  try {
    return NextResponse.json({
      result: 200,
      body: data,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({
      result: 500,
      message: "Failed to fetch events",
    });
  }
};

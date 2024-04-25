import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { handleError } from "../utils";

export interface Attendee {
  name: string;
  email: string;
  isAttending: boolean;
}

export interface IEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Timestamp;
  time: string;
  category: string;
  attendees: Attendee[];
  isArchived: boolean;
  totalPeopleAttending: number;
}

const collectionRef = collection(db, "events");

//GET ALL EVENTS
export async function getAllEvents() {
  try {
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      const eventData = doc.data();
      const event: IEvent = {
        id: doc.id,
        time: eventData.time,
        title: eventData.title,
        location: eventData.location,
        category: eventData.category,
        attendees: eventData.attendees,
        isArchived: eventData.isArchived,
        description: eventData.description,
        date: eventData.date,
        totalPeopleAttending: eventData.totalPeopleAttending,
      };
      return event;
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent(eventId: string, updatedEvent: IEvent) {
  try {
    await setDoc(doc(collectionRef, eventId), updatedEvent);
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent(eventId: string) {
  try {
    await deleteDoc(doc(collectionRef, eventId));
  } catch (error) {
    handleError(error);
  }
}

// GET EVENT BY ID
export async function getEventById(
  eventId: string
): Promise<IEvent | undefined> {
  try {
    const docRef = doc(collectionRef, eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const eventData = docSnap.data();
      return {
        id: docSnap.id,
        time: eventData.time,
        title: eventData.title,
        location: eventData.location,
        category: eventData.category,
        attendees: eventData.attendees,
        isArchived: eventData.isArchived,
        description: eventData.description,
        date: eventData.date,
        totalPeopleAttending: eventData.totalPeopleAttending,
      };
    }

    return undefined;
  } catch (error) {
    handleError(error);
  }
}

// ARCHIVE EVENT
export async function archiveEvent(eventId: string) {
  try {
    await updateDoc(doc(collectionRef, eventId), {
      isArchived: true,
    });
  } catch (error: any) {
    throw new Error("Error archiving event: ", error.message);
  }
}

// UNARCHIVE EVENT
export async function unarchiveEvent(eventId: string) {
  try {
    await updateDoc(doc(collectionRef, eventId), {
      isArchived: false,
    });
  } catch (error) {
    handleError(error);
  }
}

// CREATE EVENT
export async function createEvent(event: IEvent) {
  try {
    await setDoc(doc(collectionRef), event);
  } catch (error) {
    handleError(error);
  }
}

export interface OrangeEvent {
  id: string;
  date: string;
  title: string;
  time: string;
  location: string;
  category: string;
  description: string;
  isArchived: boolean;
  attendees: Attendee[];
  totalPeopleAttending: number;
}

export interface Attendee {
  name: string;
  email: string;
}

import { eventFormSchema } from "@/lib/validator";
import { z } from "zod";

export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Create Event",
    route: "/events/create",
  },
  {
    label: "Archived",
    route: "/archived",
  },
  {
    label: "Analytics",
    route: "/analytics",
  },
];

export const eventDefaultValues: z.infer<typeof eventFormSchema> = {
  title: "",
  description: "",
  attendees: [],
  date: new Date(),
  time: "",
  category: "",
};

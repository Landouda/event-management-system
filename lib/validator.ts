import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(400, "Description must be less than 400 characters"),
  date: z.date(),
  time: z.string(),
  category: z.string(),
  attendees: z.array(
    z.object({
      name: z.string(),
      email: z.string().email(),
    })
  ),
});

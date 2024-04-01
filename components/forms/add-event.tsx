import React from "react";
import z, { date } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, firestoreAutoId } from "@/firebase";

const defaultValues = {
  title: "",
  description: "",
  date: new Date(),
  time: "",
  category: "",
  location: "",
};

const addEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.date(),
  time: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
});

enum Tabs {
  Event,
  Attendees,
}

interface AddEventProps {
  setTabs: (tab: Tabs) => void;
  setEventId?: (id: string) => void;
}

export default function AddEvent({ setTabs, setEventId }: AddEventProps) {
  // ** Collection reference
  const eventsRef = collection(db, "events");

  const form = useForm<z.infer<typeof addEventSchema>>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(addEventSchema),
  });

  const onSubmit = async (data: z.infer<typeof addEventSchema>) => {
    try {
      const id = firestoreAutoId();
      await setDoc(doc(eventsRef, id), {
        id,
        ...data,
      });
      setTabs(Tabs.Attendees);
      setEventId && setEventId(id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid grid-cols-2 items-start gap-4")}
      >
        <div className="grid gap-2">
          <Label>Title</Label>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label>Date</Label>
          <FormField
            name="date"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      onSelect={onChange}
                      selected={new Date(value)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label>Time</Label>
          <FormField
            name="time"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <FormField
            name="category"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label>Location</Label>
          <FormField
            name="location"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          Save changes
        </Button>
      </form>
    </Form>
  );
}

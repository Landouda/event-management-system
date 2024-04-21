import { OrangeEvent } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { date } from "zod";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { db, firestoreAutoId } from "@/firebase";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { DrawerClose } from "../ui/drawer";
import { Tabs } from "../utils/custom-drawer";
import { GoogleMapsComponent } from "../GoogleMapsComponent";
import { useState } from "react";

interface EventFormProps {
  event: OrangeEvent | undefined;
  events: OrangeEvent[];
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
  setEvents: React.Dispatch<React.SetStateAction<OrangeEvent[]>>;
}

const addEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.date(),
  time: z.string().min(1),
  category: z.string().min(1),
});

const AddEventForm = ({
  event,
  events,
  setTabs,
  setEvents,
}: EventFormProps) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  // ** React Hook Form
  const form = useForm<z.infer<typeof addEventSchema>>({
    defaultValues: {
      time: event?.time,
      title: event?.title,
      category: event?.category,
      description: event?.description,
      date: event ? new Date(event.date) : new Date(),
    },
    mode: "onSubmit",
    resolver: zodResolver(addEventSchema),
  });

  // ** Contants
  const eventsRef = collection(db, "events");

  const onSubmit = async (data: z.infer<typeof addEventSchema>) => {
    try {
      if (event) {
        // ** Update event
        await updateDoc(doc(eventsRef, event.id), {
          ...data,
          location: selectedLocation,
        });
        setTabs(Tabs.Attendees);
        setEvents(
          events.map((e: OrangeEvent) =>
            e.id === event.id
              ? {
                  id: e.id,
                  date: data.date.toLocaleDateString(),
                  title: data.title,
                  time: data.time,
                  location: selectedLocation,
                  category: data.category,
                  description: data.description,
                  isArchived: false,
                  attendees: e.attendees,
                  totalPeopleAttending: e.totalPeopleAttending,
                }
              : e
          )
        );

        return;
      }
      const id = firestoreAutoId();
      const newEvent = {
        id,
        date: data.date,
        title: data.title,
        time: data.time,
        location: selectedLocation,
        category: data.category,
        description: data.description,
        isArchived: false,
        attendees: [],
        totalPeopleAttending: 0,
      };
      await setDoc(doc(eventsRef, id), newEvent);

      setTabs(Tabs.Attendees);
      setEvents([
        ...events,
        {
          id,
          date: data.date.toLocaleDateString(),
          title: data.title,
          time: data.time,
          location: selectedLocation,
          category: data.category,
          description: data.description,
          isArchived: false,
          attendees: [],
          totalPeopleAttending: 0,
        },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-4 grid-cols-1 md:grid-cols-2 px-6 mb-5 w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label>Title</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="date"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <Label>Date</Label>
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
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <Label>Time</Label>
              <Input type="time" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="category"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <Label>Category</Label>
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Concert">Concert</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <GoogleMapsComponent
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
        <div className="col-span-full md:col-span-2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
          <Button className="w-full" type="submit">
            Save
          </Button>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </div>
      </form>
    </Form>
  );
};

export default AddEventForm;

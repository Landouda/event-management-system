"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import Image from "next/image";
import Dropdown from "./Dropdown";
import DatePicker from "react-datepicker";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from "@/lib/validator";
import { Textarea } from "@/components/ui/textarea";

import "react-datepicker/dist/react-datepicker.css";
import { eventDefaultValues } from "@/constants";
import {
  Attendee,
  IEvent,
  createEvent,
  updateEvent,
} from "@/lib/actions/event.actions";
import { firestoreAutoId } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import * as XLSX from "xlsx";

const containerStyle = {
  width: "100%",
  height: "580px",
  borderRadius: "30px",
};

const EventForm = ({
  type = "Create",
  event,
  eventId,
}: {
  type?: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
}) => {
  const defaultValues = event
    ? {
        ...event,
        date:
          event.date instanceof Timestamp
            ? event.date.toDate()
            : Timestamp.now().toDate(),
      }
    : eventDefaultValues;

  const [map, setMap] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [locationSelected, setLocationSelected] = useState(false);
  const [uploadedAttendees, setUploadedAttendees] = useState<Attendee[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    event?.location || ""
  );
  const [position, setPosition] = useState({
    lat: 36.8065, // Default latitude
    lng: 10.1815, // Default longitude
  });

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  const geocoder = useRef<google.maps.Geocoder | null>(null);

  const attendeesToShow =
    uploadedAttendees.length > 0 ? uploadedAttendees : event?.attendees;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    if (isLoaded) {
      geocoder.current = new google.maps.Geocoder();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setPosition(latLng);

          geocoder.current
            ? geocoder.current.geocode(
                { location: latLng },
                (results, status) => {
                  if (status === "OK") {
                    if (results) {
                      setLocation(results[0].formatted_address);
                    } else {
                      console.log("No results found");
                    }
                  } else {
                    console.log("Geocoder failed due to: " + status);
                  }
                }
              )
            : null;
        },
        () => {
          console.log("Error getting the user's location");
        }
      );
    }
  }, [isLoaded, setLocation]);

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const onMapClick = useCallback(
    (event: any) => {
      setPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });

      geocoder.current
        ? geocoder.current.geocode(
            { location: event.latLng },
            (results, status) => {
              if (status === "OK") {
                if (results) {
                  const newLocation = results[0].formatted_address;
                  setLocation(newLocation);
                  setSelectedLocation(newLocation);
                  setLocationSelected(true);
                } else {
                  window.alert("No results found");
                }
              } else {
                window.alert("Geocoder failed due to: " + status);
              }
            }
          )
        : null;
    },
    [setLocation]
  );

  const onLocationChange = useCallback(
    (event: any) => {
      setLocation(event.target.value);

      geocoder.current
        ? geocoder.current.geocode(
            { address: event.target.value },
            (results, status) => {
              if (status === "OK") {
                setPosition({
                  lat: results ? results[0].geometry.location.lat() : 0,
                  lng: results ? results[0].geometry.location.lng() : 0,
                });
              }
            }
          )
        : null;
    },
    [setLocation]
  );

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (file.type === "text/csv") {
          if (typeof data === "string") {
            const lines = data.split("\n");
            const attendees = lines.slice(1).map((line: string) => {
              const [name, email] = line.split(",");
              return { name, email, isAttending: false };
            });

            setUploadedAttendees(attendees);
          }
        } else if (
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel"
        ) {
          if (!e.target?.result) {
            return;
          }
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: Array<[string, string]> = XLSX.utils.sheet_to_json(
            worksheet,
            { header: 1 }
          );
          const attendees = jsonData
            .slice(1)
            .filter(([name, email]) => name && email) // ignore empty fields
            .map(([name, email]) => ({ name, email, isAttending: false }));

          setUploadedAttendees(attendees);
        }
      };
      if (file.type === "text/csv") {
        reader.readAsText(file);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        reader.readAsArrayBuffer(file);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    if (type === "Create") {
      // create event
      const newEvent: IEvent = {
        ...values,
        date: Timestamp.fromDate(new Date(values.date)),
        attendees: uploadedAttendees.length > 0 ? uploadedAttendees : [],
        id: firestoreAutoId(),
        isArchived: false,
        totalPeopleAttending: 0,
        category: values.category,
        description: values.description,
        location: location || "",
        time: values.time,
        title: values.title,
      };

      await createEvent(newEvent);
      fetch(`/api/send-email/${newEvent.id}`, {
        method: "POST",
        body: JSON.stringify(
          uploadedAttendees.length > 0 ? uploadedAttendees : []
        ),
      });
      window.location.replace(`/`);
    } else {
      // update event
      const updatedEvent: IEvent = {
        ...values,
        date: Timestamp.fromDate(new Date(values.date)),
        category: values.category,
        description: values.description,
        location: locationSelected ? selectedLocation : event?.location || "",
        time: values.time,
        title: values.title,
        attendees:
          uploadedAttendees.length > 0
            ? uploadedAttendees
            : event?.attendees || [],
        id: eventId as string,
        isArchived: event?.isArchived || false,
        totalPeopleAttending: event?.totalPeopleAttending || 0,
      };
      await updateEvent(eventId as string, updatedEvent);
      // Assuming previousAttendees is the array of previous attendees
      if (
        JSON.stringify(uploadedAttendees.sort()) !==
        JSON.stringify(event?.attendees.sort())
      ) {
        fetch(`/api/send-email/${eventId}`, {
          method: "POST",
          body: JSON.stringify(
            uploadedAttendees.length > 0 ? uploadedAttendees : []
          ),
        });
      }
      window.location.replace(`/`);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col lg:flex-row items-start gap-5">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 flex-1 w-full lg:w-fit"
        >
          <div className="flex flex-col gap-5 lg:flex-row">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Event title"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <Textarea
                      placeholder="Description"
                      {...field}
                      className="textarea rounded-2xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row relative">
            <Input
              className="input-field"
              onChange={onLocationChange}
              placeholder="Event location or Online"
              value={
                selectedLocation ||
                (event ? event.location : showMap ? location : "")
              }
            />
            <Button
              size="sm"
              type="button"
              className="absolute right-3 top-2"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                      <Image
                        width={24}
                        height={24}
                        alt="calendar"
                        className="filter-grey"
                        src="/assets/icons/calendar.svg"
                      />
                      <p className="ml-3 whitespace-nowrap text-grey-600">
                        Date:
                      </p>
                      <DatePicker
                        showTimeSelect
                        timeInputLabel="Time:"
                        selected={field.value}
                        dateFormat="MM/dd/yyyy"
                        wrapperClassName="datePicker"
                        onChange={(date: Date) => field.onChange(date)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                      <Image
                        width={24}
                        height={24}
                        alt="calendar"
                        className="filter-grey"
                        src="/assets/icons/calendar.svg"
                      />
                      <p className="ml-3 whitespace-nowrap text-grey-600">
                        Time:
                      </p>
                      <Input type="time" {...field} className="input-field" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Input
            type="file"
            className="input-field"
            onChange={handleFileUpload}
          />

          {attendeesToShow && attendeesToShow.length > 0 && (
            <div className="flex gap-3 flex-col">
              <p className="font-semibold">
                {attendeesToShow.length}{" "}
                {attendeesToShow.length === 1 ? "Attendee " : "Attendees "}
                Invited
              </p>
              <table className="w-full table-auto rounded">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left bg-grey-50 text-black">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left bg-grey-50 text-black">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendeesToShow.map((attendee, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{attendee.name}</td>
                      <td className="border px-4 py-2">{attendee.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Button
            size="lg"
            type="submit"
            className="button col-span-2 w-full"
            disabled={form.formState.isSubmitting}
          >
            {type} Event
          </Button>
        </form>

        <div
          className={`${showMap ? "block flex-1 w-full" : "hidden flex-[0]"}`}
        >
          {isLoaded && position && (
            <GoogleMap
              zoom={8}
              onLoad={onLoad}
              center={position}
              onClick={onMapClick}
              onUnmount={onUnmount}
              mapContainerStyle={containerStyle}
            >
              <MarkerF position={position} />
            </GoogleMap>
          )}
        </div>
      </div>
    </Form>
  );
};

export default EventForm;

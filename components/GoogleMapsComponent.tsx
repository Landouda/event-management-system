import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface GoogleMapsComponentProps {
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
}

export function GoogleMapsComponent(props: GoogleMapsComponentProps) {
  // ** Destrcuture props
  const { selectedLocation, setSelectedLocation } = props;

  const [map, setMap] = useState(null);
  // ** Locate at th euser's current location
  const [position, setPosition] = useState({
    lat: 36.8065, // Default latitude
    lng: 10.1815, // Default longitude
  });

  const [isLoading, setIsLoading] = useState(true);

  const geocoder = useRef<google.maps.Geocoder | null>(null);

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
          setIsLoading(false);

          geocoder.current
            ? geocoder.current.geocode(
                { location: latLng },
                (results, status) => {
                  if (status === "OK") {
                    if (results) {
                      setSelectedLocation(results[0].formatted_address);
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
          setIsLoading(false);
        }
      );
    }
  }, [isLoaded, setSelectedLocation]);

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
                  setSelectedLocation(results[0].formatted_address);
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
    [setSelectedLocation]
  );

  const onLocationChange = useCallback(
    (event: any) => {
      setSelectedLocation(event.target.value);

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
    [setSelectedLocation]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-start gap-2 flex-col justify-end h-full">
          <Label>Location</Label>
          <div className="w-full relative">
            <Input
              defaultValue={selectedLocation}
              placeholder="Select a location"
              className="cursor-pointer focus:border-transparent"
            />
            <Button
              size="xs"
              variant="outline"
              className="absolute top-1.5 right-1.5 border border-gray-300 text-xs"
            >
              Select
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Map</DialogTitle>
          <DialogDescription>Choose a location from the map</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={selectedLocation}
              onChange={onLocationChange}
            />
          </div>

          {!isLoading ? (
            isLoaded ? (
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
            ) : (
              <></>
            )
          ) : (
            <div>
              <p>Loading...</p>
            </div>
          )}
        </div>
        <DialogClose asChild>
          <Button type="button">Save Changes</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

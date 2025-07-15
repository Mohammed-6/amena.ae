import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { X } from "lucide-react";
import { useFileContext } from "@/context/FileUploadContext";
import { toast } from "react-toastify";

const GOOGLE_MAP_LIBRARIES: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places"];

interface Props {
  onPlaceSelected: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

const LocationSelectorModal = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!, // 🔒 Replace with env variable in production
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { toogleHeaderlocation, confirmAddress } = useFileContext();
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || "";
          console.log(lat, lng, address);
        }
      });
    }
  }, [isLoaded]);

  const showPacContainer = () => {
    const pacContainers = document.querySelectorAll(".pac-container.hidden");
    pacContainers.forEach((el) => {
      (el as HTMLElement).classList.remove("hidden");
    });
  };

  useEffect(() => {
    showPacContainer();
  }, []); // runs once when component mounts

  const detectLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            const address = results[0].formatted_address;
            console.log(lat, lng, address);
            confirmAddress(lat, lng, address);
          } else {
            // toast.error("Address not found");
            console.log(lat, lng, null);
            confirmAddress(lat, lng);
          }
          setLoadingLocation(false);
        });
      },
      () => {
        toast.error("Location access denied");
        setLoadingLocation(false);
      }
    );
  };

  const hidePacContainer = () => {
    const pacContainers = document.querySelectorAll(".pac-container");
    pacContainers.forEach((el) => {
      (el as HTMLElement).classList.add("hidden");
    });
  };

  const handleClose = () => {
    hidePacContainer();
    toogleHeaderlocation(); // your actual close logic
  };

  if (!isLoaded)
    return <div className="text-center p-6">Loading map tools...</div>;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">
              Change Location
            </h4>
            <button
              className="text-gray-400 hover:text-gray-600 text-xs"
              onClick={handleClose}
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Detect Location Button */}
            <button
              onClick={detectLocation}
              disabled={loadingLocation}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 font-semibold transition"
            >
              {loadingLocation ? "Detecting location..." : "Detect my location"}
            </button>

            {/* Or Divider */}
            <div className="flex items-center gap-2 text-gray-400 text-xs justify-center">
              <div className="h-px flex-1 bg-gray-300" />
              OR
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            {/* Search Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for an address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationSelectorModal;
